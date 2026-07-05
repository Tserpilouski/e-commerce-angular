import { inject, Injectable, signal } from '@angular/core';
import { ProductFilters } from '@models/products/product-filters.model';
import { Category } from '@models/products/category.model';
import { ProductVariant } from '@models/products/product-variant.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiClient = inject(ApiClientService);

  readonly products = signal<Product[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Dynamic filter options based on fetched items
  readonly availableBrands = signal<string[]>([]);
  readonly availableAttributes = signal<Map<string, unknown[]>>(new Map());
  readonly categories = signal<Category[]>([]);

  async fetchCategories() {
    try {
      const response = await this.apiClient.ecomFetchWithState<{ results: Category[] }>('categories');
      this.categories.set(response.results || []);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  }

  private lastOptionsCategoryId: string | undefined | null = undefined;

  private async loadFilterOptions(categoryId?: string): Promise<void> {
    if (this.lastOptionsCategoryId === categoryId) {
      return;
    }
    this.lastOptionsCategoryId = categoryId;

    try {
      const params: Record<string, string | number | boolean> = {
        limit: 100,
        offset: 0,
        expand: 'productType',
      };
      if (categoryId) {
        params['filter'] = `categories.id:"${categoryId}"`;
      }

      const response = await this.apiClient.ecomFetch<ProductPagedQueryResponse>('product-projections/search', {
        params,
      });

      const allProducts = response.results ?? [];
      allProducts.forEach((p) => this.expandProductAttributes(p));

      const attributesMap = new Map<string, Set<unknown>>();

      for (const p of allProducts) {
        for (const { name, value } of p.masterVariant?.attributes ?? []) {
          const valuesSet = attributesMap.get(name) ?? new Set<unknown>();
          valuesSet.add(value);
          attributesMap.set(name, valuesSet);
        }
      }

      const brandSet = attributesMap.get('brand') ?? new Set<unknown>();
      attributesMap.delete('brand');

      const attributesArrayMap = new Map<string, unknown[]>();
      for (const [name, set] of attributesMap) {
        attributesArrayMap.set(
          name,
          Array.from(set).sort((a, b) =>
            typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)),
          ),
        );
      }

      this.availableBrands.set(Array.from(brandSet).map(String).sort());
      this.availableAttributes.set(attributesArrayMap);
    } catch (e) {
      console.error('Failed to load filter options', e);
    }
  }

  async fetchPagedProducts(
    limit = 20,
    offset = 0,
    search?: string,
    filters?: ProductFilters,
  ): Promise<ProductPagedQueryResponse> {
    await this.loadFilterOptions(filters?.categoryId);

    const queryParams: Record<string, string | number | boolean | string[]> = {
      limit,
      offset,
      expand: 'productType',
    };

    if (search?.trim()) {
      queryParams['text.en'] = search.trim();
    }

    const filterQueries: string[] = [];

    if (filters?.categoryId) {
      filterQueries.push(`categories.id:"${filters.categoryId}"`);
    }

    if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
      const min = filters.priceMin ?? '*';
      const max = filters.priceMax ?? '*';
      filterQueries.push(`variants.price.centAmount:range (${min} to ${max})`);
    }

    const attributeFilters = {
      ...(filters?.brands?.length && { brand: filters.brands }),
      ...filters?.dynamicFilters,
    };

    for (const [name, values] of Object.entries(attributeFilters)) {
      if (values?.length) {
        const valString = values.map((v) => `"${v}"`).join(',');
        filterQueries.push(`variants.attributes.${name}:${valString}`);
      }
    }

    if (filterQueries.length > 0) {
      queryParams['filter'] = filterQueries;
    }

    const response = await this.apiClient.ecomFetchWithState<ProductPagedQueryResponse>(
      'product-projections/search',
      this.loading,
      this.error,
      { params: queryParams },
    );

    const results = response.results ?? [];
    results.forEach((p) => this.expandProductAttributes(p));

    this.products.set(results);
    return response;
  }

  async fetchProductByKey(key: string): Promise<Product> {
    const data = await this.apiClient.ecomFetchWithState<Product>(
      `product-projections/key=${key}`,
      this.loading,
      this.error,
      { params: { expand: 'productType' } },
    );
    this.expandProductAttributes(data);
    this.selectedProduct.set(data);
    return data;
  }

  private expandProductAttributes(product: Product): void {
    const attributes = product?.productType?.obj?.attributes;
    if (!attributes) return;

    const labels = new Map(attributes.map((d) => [d.name, d.label['en'] || d.name]));

    for (const v of [product.masterVariant]) {
      v?.attributes?.forEach((a) => {
        a.label = labels.get(a.name) ?? a.name;
      });
    }
  }

  findVariant(product: Product, predicate: (variant: ProductVariant) => boolean): ProductVariant | null {
    if (product.masterVariant && predicate(product.masterVariant)) {
      return product.masterVariant;
    }
    return product.variants?.find(predicate) || null;
  }

  getAllVariants(product: Product): ProductVariant[] {
    if (!product) return [];
    return [product.masterVariant, ...(product.variants || [])].filter(Boolean) as ProductVariant[];
  }

  async searchProducts(
    query: string,
    limit = 20,
    offset = 0,
    filters?: ProductFilters,
  ): Promise<ProductPagedQueryResponse> {
    return this.fetchPagedProducts(limit, offset, query, filters);
  }
}
