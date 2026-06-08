import { Component, signal, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products/product.model';
import { PaginationMode } from '../../shared/components/pagination-wrapper/models/pagination-mode.enum';
import { PagedQueryResponse } from '../../models/common/paged-query-response.model';
import { PaginationWrapperComponent } from '../../shared/components/pagination-wrapper/pagination-wrapper.component';
import { ProductGaleriaComponent } from '../../galeria';

@Component({
  selector: 'ec-product-list',
  imports: [PaginationWrapperComponent, ProductGaleriaComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  readonly PaginationMode = PaginationMode;
  private readonly productService = inject(ProductService);

  numericLoading = signal(false);
  numericResponse = signal<PagedQueryResponse>({
    limit: 4,
    offset: 0,
    count: 0,
    total: 0,
  });
  paginatedProducts = signal<Product[]>([]);

  loadMoreLoading = signal(false);
  loadMoreResponse = signal<PagedQueryResponse>({
    limit: 4,
    offset: 0,
    count: 0,
    total: 0,
  });
  cumulativeProducts = signal<Product[]>([]);

  ngOnInit() {
    this.onNumericPageChange({ limit: 4, offset: 0 });
    this.onLoadMore({ limit: 4, offset: 0 }, true);
  }

  async onNumericPageChange(event: { limit: number; offset: number }) {
    this.numericLoading.set(true);
    try {
      const response = await this.productService.fetchPagedProducts(event.limit, event.offset);
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
      const response = await this.productService.fetchPagedProducts(event.limit, event.offset);
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

  onAddToCard(products?: Product) {
    console.log('added to card', products);
  }
}
