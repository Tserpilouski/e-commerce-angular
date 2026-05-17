import { Component, effect, inject, input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductSpecificationsComponent } from '../../components/product-specifications/product-specifications.component';

@Component({
  selector: 'app-product-details',
  imports: [ProductSpecificationsComponent],
  template: `
    <div class="product-details">
      @if (loading()) {
        <div class="product-details__status">
          <span>Loading specifications...</span>
        </div>
      } @else if (error()) {
        <div class="product-details__status product-details__status--error">
          <p>{{ error() }}</p>
        </div>
      } @else if (product()) {
        <div class="product-details__specs">
          <app-product-specifications [attributes]="product()!.masterVariant.attributes" />
        </div>
      } @else {
        <div class="product-details__status">
          <p>No specifications available.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .product-details {
        max-width: 700px;
        margin: 0 auto;
        padding: 3rem 1.5rem;
        font-family:
          'Inter',
          system-ui,
          -apple-system,
          sans-serif;
      }
      .product-details__specs {
        display: flex;
        justify-content: center;
      }
      .product-details__status {
        text-align: center;
        padding: 4rem 1rem;
        color: #64748b;
        font-size: 1.125rem;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px dashed #cbd5e1;
      }
      .product-details__status--error {
        background: #fef2f2;
        border-color: #fca5a5;
        color: #991b1b;
      }
    `,
  ],
})
export class ProductDetailsComponent {
  readonly key = input<string>();
  private readonly productService = inject(ProductService);

  readonly product = this.productService.selectedProduct;
  readonly loading = this.productService.loading;
  readonly error = this.productService.error;

  constructor() {
    effect(async () => {
      const productKey = this.key();
      if (productKey) {
        await this.productService.fetchProductByKey(productKey);
      }
    });
  }
}
