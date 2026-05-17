import { inject, Injectable, signal } from '@angular/core';
import { ProductPagedQueryResponse } from '../models/products/product-paged-query-response.model';
import { Product } from '../models/products/product.model';
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

  async fetchProducts(limit = 20, offset = 0): Promise<Product[]> {
    const data = await this.apiClient.ecomFetchWithState<ProductPagedQueryResponse>(
      `product-projections?limit=${limit}&offset=${offset}`,
      this.loading,
      this.error,
    );
    this.products.set(data.results);
    return data.results;
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
}
