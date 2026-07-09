import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { ProductService } from '@services/product.service';
import { CartService } from '@services/cart';
import { Product } from '@models/products/product.model';
import { PaginationMode } from '@shared/components/pagination-wrapper/models/pagination-mode.enum';
import { PagedQueryResponse } from '@models/common/paged-query-response.model';
import { PaginationWrapperComponent } from '@shared/components/pagination-wrapper/pagination-wrapper.component';
import { ProductGaleriaComponent } from '@pages/home/components/galeria/galeria';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductFilters } from '@models/products/product-filters.model';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ec-product-list',
  imports: [PaginationWrapperComponent, ProductGaleriaComponent, ProductFiltersComponent, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  readonly PaginationMode = PaginationMode;
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  searchQuery = signal<string>('');
  filters = signal<ProductFilters | undefined>(undefined);

  numericLoading = signal(false);
  numericResponse = signal<PagedQueryResponse>({
    limit: 9,
    offset: 0,
    count: 0,
    total: 0,
  });
  paginatedProducts = signal<Product[]>([]);

  loadMoreLoading = signal(false);
  loadMoreResponse = signal<PagedQueryResponse>({
    limit: 9,
    offset: 0,
    count: 0,
    total: 0,
  });
  cumulativeProducts = signal<Product[]>([]);

  ngOnInit() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const search = params['search'] || '';
      this.searchQuery.set(search);

      const parsedFilters: ProductFilters = {};
      if (params['category']) parsedFilters.categoryId = params['category'];
      if (params['priceMin']) parsedFilters.priceMin = parseInt(params['priceMin'], 10) * 100;
      if (params['priceMax']) parsedFilters.priceMax = parseInt(params['priceMax'], 10) * 100;
      if (params['brands']) parsedFilters.brands = params['brands'].split(',');

      const dynamicFilters: Record<string, string[]> = {};
      for (const key of Object.keys(params)) {
        if (key.startsWith('attr_')) {
          dynamicFilters[key.substring(5)] = params[key].split(',');
        }
      }

      if (Object.keys(dynamicFilters).length > 0) {
        parsedFilters.dynamicFilters = dynamicFilters;
      }

      this.filters.set(Object.keys(parsedFilters).length > 0 ? parsedFilters : undefined);
      this.onNumericPageChange({ limit: 9, offset: 0 });
      this.onLoadMore({ limit: 9, offset: 0 }, true);
    });
  }

  async onNumericPageChange(event: { limit: number; offset: number }) {
    this.numericLoading.set(true);
    try {
      const response = await this.productService.fetchPagedProducts(
        event.limit,
        event.offset,
        this.searchQuery() || undefined,
        this.filters(),
      );
      this.numericResponse.set({
        limit: response.limit,
        offset: response.offset,
        count: response.count,
        total: response.total ?? response.results.length,
      });
      this.paginatedProducts.set(response.results || []);
    } catch (err) {
      console.error('Failed to load products for numeric pagination:', err);
      this.paginatedProducts.set([]);
    } finally {
      this.numericLoading.set(false);
    }
  }

  async onLoadMore(event: { limit: number; offset: number }, reset = false) {
    this.loadMoreLoading.set(true);
    try {
      const response = await this.productService.fetchPagedProducts(
        event.limit,
        event.offset,
        this.searchQuery() || undefined,
        this.filters(),
      );
      this.loadMoreResponse.set({
        limit: response.limit,
        offset: response.offset,
        count: response.count,
        total: response.total ?? response.results.length,
      });

      const results = response.results || [];
      if (reset) {
        this.cumulativeProducts.set(results);
      } else {
        this.cumulativeProducts.update((prev) => [...prev, ...results]);
      }
    } catch (err) {
      console.error('Failed to load products for load more:', err);
      if (reset) {
        this.cumulativeProducts.set([]);
      }
    } finally {
      this.loadMoreLoading.set(false);
    }
  }

  onAddToCart(product?: Product) {
    if (product) {
      this.cartService.addProduct(product);
    }
  }

  onClearSearch() {
    this.router.navigate([], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  onFiltersChanged(newFilters: ProductFilters) {
    const queryParams: Record<string, string | null> = {
      search: this.searchQuery() || null,
      category: newFilters.categoryId || null,
      priceMin: newFilters.priceMin ? (newFilters.priceMin / 100).toString() : null,
      priceMax: newFilters.priceMax ? (newFilters.priceMax / 100).toString() : null,
      brands: newFilters.brands?.length ? newFilters.brands.join(',') : null,
    };

    if (newFilters.dynamicFilters) {
      for (const [key, values] of Object.entries(newFilters.dynamicFilters)) {
        queryParams[`attr_${key}`] = values.length ? values.join(',') : null;
      }
    }

    // Clear removed dynamic filter parameters from URL
    for (const key of Object.keys(this.route.snapshot.queryParams)) {
      if (key.startsWith('attr_') && !newFilters.dynamicFilters?.[key.substring(5)]) {
        queryParams[key] = null;
      }
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
