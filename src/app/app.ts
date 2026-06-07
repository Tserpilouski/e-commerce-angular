import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Product } from './models/products/product.model';
import { ProductGaleriaComponent } from './galeria';
import { Button } from './button/button';
import { Input } from './shared/components/input/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationWrapperComponent } from './shared/components/pagination-wrapper/pagination-wrapper.component';
import { PaginationMode } from './shared/components/pagination-wrapper/models/pagination-mode.enum';
import { PagedQueryResponse } from './models/common/paged-query-response.model';
import { ProductService } from './services/product.service';

@Component({
  selector: 'ec-root',
  imports: [
    RouterOutlet,
    ProductGaleriaComponent,
    Button,
    Input,
    ReactiveFormsModule,
    PaginationWrapperComponent,
    Header,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly PaginationMode = PaginationMode;
  private readonly productService = inject(ProductService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.email]),
  });

  // Numeric mode state
  numericLoading = signal(false);
  numericResponse = signal<PagedQueryResponse>({
    limit: 4,
    offset: 0,
    count: 0,
    total: 0,
  });
  paginatedProducts = signal<Product[]>([]);

  // Load More mode state
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

  onAddToCard(products: Product) {
    console.log('added to card', products);
  }
}
