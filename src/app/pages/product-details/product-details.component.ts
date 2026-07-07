import { Component, effect, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '@services/product.service';
import { ApiClientService } from '@services/api-client.service';
import { ProductSpecificationsComponent } from './components/product-specifications/product-specifications.component';
import { Tabs } from '@shared/components/tabs/tabs';
import { TabOption } from '@shared/components/tabs/models/tabOption.model';
import { ToastService } from '@services/toast/toast.service';
import { ToastType } from '@shared/components/toast/models/toast.model';
import { ProductTab } from './models/product-tab.enum';
import { ProductAttribute } from './models/product-attribute.enum';
import { ProductType } from '@models/products/product-type.enum';
import { CustomObjectContainer } from '@models/common/custom-object-container.enum';
import { ProductVariant } from '@models/products/product-variant.model';
import { Attribute } from '@models/attributes/attribute.model';

const DEFAULT_BRAND = 'PREMIUM TECH';

interface Review {
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'ec-product-details',
  imports: [CommonModule, FormsModule, MatIconModule, ProductSpecificationsComponent, Tabs],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  readonly ProductTab = ProductTab;

  readonly key = input<string>();
  private readonly productService = inject(ProductService);
  private readonly toastService = inject(ToastService);
  private readonly apiClient = inject(ApiClientService);

  readonly product = this.productService.selectedProduct;
  readonly loading = this.productService.loading;
  readonly error = this.productService.error;
  readonly loadingReviews = signal<boolean>(false);

  readonly selectedColor = signal<string>('');
  readonly selectedStorage = signal<string>('');
  readonly quantity = signal<number>(1);
  readonly selectedImageIndex = signal<number>(0);
  readonly activeTabId = signal<ProductTab>(ProductTab.Specs);

  readonly reviews = signal<Review[]>([]);

  newReviewAuthor = '';
  newReviewRating = 5;
  newReviewTitle = '';
  newReviewContent = '';

  readonly tabOptions = computed<TabOption[]>(() => [
    { id: ProductTab.Specs, label: 'Technical Specifications' },
    { id: ProductTab.Reviews, label: `Customer Reviews (${this.reviews().length})` },
  ]);

  readonly variantOptionLabel = computed<string>(() => {
    const prod = this.product();
    if (!prod) return 'Options';

    const storageAttr = prod.masterVariant.attributes?.find(
      (a) =>
        a.name === ProductAttribute.StorageGb ||
        a.name === ProductAttribute.Storage ||
        a.name === ProductAttribute.Size,
    );
    return storageAttr?.label ?? storageAttr?.name ?? 'Options';
  });

  readonly availableColors = computed<string[]>(() => {
    const prod = this.product();
    if (!prod) return [];

    const colors = new Set<string>();
    this.productService.getAllVariants(prod).forEach((v) => {
      const vc = v.attributes?.find((a: Attribute) => a.name === ProductAttribute.Color)?.value;
      if (vc) colors.add(String(vc));
    });

    return Array.from(colors);
  });

  readonly availableStorages = computed<string[]>(() => {
    const prod = this.product();
    if (!prod) return [];

    const storages = new Set<string>();
    this.productService.getAllVariants(prod).forEach((v) => {
      const vs = v.attributes?.find(
        (a: Attribute) => a.name === ProductAttribute.StorageGb || a.name === ProductAttribute.Storage,
      )?.value;
      if (vs !== undefined && vs !== null) {
        storages.add(String(vs));
      }
    });

    return Array.from(storages);
  });

  readonly selectedVariant = computed(() => {
    const prod = this.product();
    if (!prod) return null;

    const color = this.selectedColor();
    const storage = this.selectedStorage();

    return this.productService.findVariant(prod, (v: ProductVariant) => this.variantMatches(v, color, storage));
  });

  private variantMatches(variant: ProductVariant, color: string, storage: string): boolean {
    const vc = variant.attributes?.find((a: Attribute) => a.name === ProductAttribute.Color)?.value;
    const vs = variant.attributes?.find(
      (a: Attribute) => a.name === ProductAttribute.StorageGb || a.name === ProductAttribute.Storage,
    )?.value;

    const storageStr = typeof vs === 'number' ? `${vs}GB` : String(vs || '');

    const colorMatches = vc ? vc === color : true;
    const storageMatches = vs ? storageStr === storage : true;

    return colorMatches && storageMatches;
  }

  readonly productRealImage = computed<string>(() => {
    const prod = this.product();
    const url = prod?.masterVariant?.images?.[0]?.url;
    return url ?? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
  });

  readonly variantImages = computed<string[]>(() => {
    const prod = this.product();
    if (!prod) return [];

    const variant = this.selectedVariant();
    if (variant && variant.images && variant.images.length > 0) {
      return variant.images.map((img) => img.url);
    }

    const mvImages = prod.masterVariant.images || [];
    if (mvImages.length > 0) {
      return mvImages.map((img) => img.url);
    }

    return [this.productRealImage()];
  });

  readonly currentImage = computed<string>(() => {
    const imgs = this.variantImages();
    const idx = this.selectedImageIndex();
    return imgs[idx] ?? imgs[0] ?? this.productRealImage();
  });

  readonly currentPrice = computed<number>(() => {
    const variant = this.selectedVariant();
    if (variant && variant.prices?.[0]) {
      return (variant.prices[0].value?.centAmount || 0) / 100;
    }

    const prod = this.product();
    if (!prod) return 0;

    // TODO: Fetch variant prices directly from Commercetools to avoid hardcoded surcharges
    const baseCentAmount = prod.masterVariant?.prices?.[0]?.value?.centAmount ?? 249900;
    const basePrice = baseCentAmount / 100;

    let surcharge = 0;
    const storage = this.selectedStorage();
    const list = this.availableStorages();
    const idx = list.indexOf(storage);

    if (idx === 1) surcharge = 200;
    else if (idx === 2) surcharge = 600;
    else if (idx >= 3) surcharge = 1200;

    return basePrice + surcharge;
  });

  readonly isLaptop = computed<boolean>(() => {
    const prod = this.product();
    if (!prod) return false;
    return prod.productType?.obj?.name === ProductType.Laptops;
  });

  readonly laptopSpecs = computed(() => {
    const prod = this.product();
    const attrs = prod?.masterVariant?.attributes || [];
    const brand = attrs.find((a) => a.name === ProductAttribute.Brand)?.value;
    const cpu = attrs.find((a) => a.name === ProductAttribute.Cpu)?.value;
    const ram = attrs.find((a) => a.name === ProductAttribute.RamGb)?.value;
    const storage = attrs.find((a) => a.name === ProductAttribute.StorageGb)?.value;

    return {
      brand: brand || '',
      cpu: cpu || '',
      ram: ram ? `${ram}GB` : '',
      storage: storage ? `${storage}GB SSD` : '',
      resolution: '',
      brightness: '',
      refreshRate: '',
    };
  });

  readonly productBrand = computed<string>(() => {
    const prod = this.product();
    if (!prod) return DEFAULT_BRAND;
    const brandAttr = prod.masterVariant.attributes?.find(
      (a) => a.name === ProductAttribute.Brand || a.name === ProductAttribute.Manufacturer,
    )?.value;
    if (brandAttr) return String(brandAttr).toUpperCase();

    const title = prod.name['en'] || '';
    const words = title.split(' ');
    return words[0] ? words[0].toUpperCase() : DEFAULT_BRAND;
  });

  readonly averageRating = computed<number>(() => {
    const list = this.reviews();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  });

  readonly starsCount = computed<Record<number, number>>(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.reviews().forEach((r) => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    return counts;
  });

  constructor() {
    effect(async () => {
      const productKey = this.key();
      if (productKey) {
        await this.productService.fetchProductByKey(productKey);

        const colors = this.availableColors();
        this.selectedColor.set(colors[0] ?? '');

        const storages = this.availableStorages();
        this.selectedStorage.set(storages[0] ?? '');

        this.quantity.set(1);
        this.selectedImageIndex.set(0);
        this.activeTabId.set(ProductTab.Specs);

        await this.fetchReviews(productKey);
      }
    });
  }

  async fetchReviews(productKey: string) {
    this.loadingReviews.set(true);
    try {
      const response = await this.apiClient.ecomFetch<unknown>(
        `custom-objects/${CustomObjectContainer.ProductReviews}/${productKey}`,
      );
      if (response && (response as { value?: Review[] }).value) {
        this.reviews.set((response as { value: Review[] }).value);
      }
    } catch (err: unknown) {
      console.error('Failed to load reviews from database:', err);
    } finally {
      this.loadingReviews.set(false);
    }
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
    this.selectedImageIndex.set(0);
  }

  selectStorage(storage: string) {
    this.selectedStorage.set(storage);
  }

  selectTab(tabId: string) {
    this.activeTabId.set(tabId as ProductTab);
  }

  incrementQuantity() {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity() {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  addToCart() {
    const prod = this.product();
    if (!prod) return;

    const name = prod.name['en'] || 'Product';
    const color = this.selectedColor();
    const storage = this.selectedStorage();
    const qty = this.quantity();
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      this.currentPrice(),
    );

    const configDetails = [color, storage].filter(Boolean).join(', ');
    const displayDetails = configDetails ? ` (${configDetails})` : '';

    this.toastService.show(
      ToastType.Success,
      `Added ${qty}x ${name}${displayDetails} to cart - Total: ${formattedPrice}`,
      3500,
    );
  }

  async onSubmitReview() {
    if (!this.newReviewAuthor.trim() || !this.newReviewTitle.trim() || !this.newReviewContent.trim()) {
      this.toastService.show(ToastType.Error, 'Please fill in all review fields.', 3000);
      return;
    }

    const newReview: Review = {
      author: this.newReviewAuthor,
      rating: Number(this.newReviewRating),
      title: this.newReviewTitle,
      content: this.newReviewContent,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    const updatedReviews = [newReview, ...this.reviews()];
    this.reviews.set(updatedReviews);

    const productKey = this.key();
    if (productKey) {
      try {
        await this.apiClient.ecomFetch<unknown>('custom-objects', {
          method: 'POST',
          body: {
            container: CustomObjectContainer.ProductReviews,
            key: productKey,
            value: updatedReviews,
          },
        });
        this.toastService.show(ToastType.Success, 'Review submitted and saved to cloud database!', 3500);
      } catch (err) {
        console.error('Failed to save review to database:', err);
        this.toastService.show(ToastType.Error, 'Review submitted locally but failed to save to cloud database.', 3500);
      }
    }

    this.newReviewAuthor = '';
    this.newReviewRating = 5;
    this.newReviewTitle = '';
    this.newReviewContent = '';
  }
}
