import { Component, signal, inject, OnInit } from '@angular/core';
import { ProductService } from '@services/product.service';
import { Product } from '@models/products/product.model';
import { PaginationMode } from '@shared/components/pagination-wrapper/models/pagination-mode.enum';
import { PagedQueryResponse } from '@models/common/paged-query-response.model';
import { PaginationWrapperComponent } from '@shared/components/pagination-wrapper/pagination-wrapper.component';
import { ProductGaleriaComponent } from '@pages/home/components/galeria/galeria';

@Component({
  selector: 'ec-product-list',
  imports: [PaginationWrapperComponent, ProductGaleriaComponent, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  readonly PaginationMode = PaginationMode;
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  searchQuery = signal<string>('');

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
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const search = params['search'] || '';
      this.searchQuery.set(search);
      this.onNumericPageChange({ limit: 4, offset: 0 });
      this.onLoadMore({ limit: 4, offset: 0 }, true);
    });
  }

  async onNumericPageChange(event: { limit: number; offset: number }) {
    this.numericLoading.set(true);
    try {
      const response = await this.productService.fetchPagedProducts(
        event.limit,
        event.offset,
        this.searchQuery() || undefined,
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

  onAddToCart(products?: Product) {
    console.log('added to cart', products);
  }

  onClearSearch() {
    this.router.navigate([], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }
}
