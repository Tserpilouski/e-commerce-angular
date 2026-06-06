import { Component, effect, inject, input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductSpecificationsComponent } from './product-specifications/product-specifications.component';

@Component({
  selector: 'ec-product-details',
  selector: 'ec-product-details',
  imports: [ProductSpecificationsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
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
