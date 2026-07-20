import { inject, Injectable, signal } from '@angular/core';
import { ProductPagedQueryResponse } from '@models/products/product-paged-query-response.model';
import { Product } from '@models/products/product.model';
import { ProductFilters } from '@models/products/product-filters.model';
import { Category } from '@models/products/category.model';
import { ProductVariant } from '@models/products/product-variant.model';
import { ApiClientService } from './api-client.service';
import { localize, extractAttributeLabel } from '@shared/pipes/localize.pipe';

export interface FilterOption {
  key: string;
  label: string;
}

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
  readonly availableBrands = signal<FilterOption[]>([]);
  readonly availableAttributes = signal<Map<string, FilterOption[]>>(new Map());
  readonly categories = signal<Category[]>([]);
  readonly localizedAttributes = new Set<string>();

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

      const attributesMap = new Map<string, Map<string, string>>();

      allProducts
        .flatMap((p) => [p.masterVariant, ...(p.variants || [])].filter(Boolean) as ProductVariant[])
        .flatMap((v) => v.attributes ?? [])
        .forEach(({ name, value }) => {
          const optionsMap = attributesMap.get(name) ?? new Map<string, string>();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Array.isArray(value) ? value : [value]).forEach((val: any) => {
            if (val == null) return;

            let key = String(val);
            let label = String(val);

            if (typeof val === 'object' && 'key' in val) {
              key = String(val.key);
              label = extractAttributeLabel(val);
            } else if (typeof val === 'object' && Object.values(val).some((v) => typeof v === 'string')) {
              key = label = localize(val);
              this.localizedAttributes.add(name);
            }

            optionsMap.set(key, label);
          });

          attributesMap.set(name, optionsMap);
        });

      const brandMap = attributesMap.get('brand') ?? new Map<string, string>();
      attributesMap.delete('brand');

      const attributesArrayMap = new Map<string, FilterOption[]>();
      for (const [name, optionsMap] of attributesMap) {
        const optionsArray = Array.from(optionsMap.entries()).map(([k, l]) => ({ key: k, label: l }));
        optionsArray.sort((a, b) => a.label.localeCompare(b.label));
        attributesArrayMap.set(name, optionsArray);
      }

      this.availableBrands.set(
        Array.from(brandMap.entries())
          .map(([k, l]) => ({ key: k, label: l }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      );
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
        const queryName = this.localizedAttributes.has(name) ? `${name}.en` : name;
        filterQueries.push(`variants.attributes.${queryName}:${valString}`);
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

    const labels = new Map(attributes.map((d) => [d.name, localize(d.label, d.name)]));

    const allVariants = [product.masterVariant, ...(product.variants || [])].filter(Boolean) as ProductVariant[];
    for (const v of allVariants) {
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
