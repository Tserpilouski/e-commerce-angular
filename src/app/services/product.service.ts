import { inject, Injectable, signal } from '@angular/core';
import { ProductPagedQueryResponse } from '@models/products/product-paged-query-response.model';
import { Product } from '@models/products/product.model';
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

  async fetchPagedProducts(limit = 20, offset = 0, search?: string): Promise<ProductPagedQueryResponse> {
    const query = search?.trim().toLowerCase();

    if (query) {
      // Fetch a larger batch for client-side filtering because Commercetools
      // does not natively support partial string matches without SearchKeywords.
      const response = await this.apiClient.ecomFetchWithState<ProductPagedQueryResponse>(
        'product-projections',
        this.loading,
        this.error,
        { params: { limit: 100, offset: 0 } },
      );

      const allProducts = response.results ?? [];
      const filteredProducts = allProducts.filter(
        (p) => p.name?.['en']?.toLowerCase().includes(query) || p.description?.['en']?.toLowerCase().includes(query),
      );

      // Apply manual pagination to the filtered results
      const paginatedResults = filteredProducts.slice(offset, offset + limit);

      this.products.set(paginatedResults);
      return {
        ...response,
        limit,
        offset,
        count: paginatedResults.length,
        total: filteredProducts.length,
        results: paginatedResults,
      };
    }

    const response = await this.apiClient.ecomFetchWithState<ProductPagedQueryResponse>(
      'product-projections',
      this.loading,
      this.error,
      { params: { limit, offset } },
    );

    this.products.set(response.results ?? []);
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

  async searchProducts(query: string, limit = 20, offset = 0): Promise<ProductPagedQueryResponse> {
    return this.fetchPagedProducts(limit, offset, query);
  }
}
