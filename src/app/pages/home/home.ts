import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';
import { ProductService } from '@services/product.service';
import { Product } from '@models/products/product.model';

import { LocalizePipe } from '@shared/pipes/localize.pipe';

@Component({
  selector: 'ec-home',
  imports: [CardComponent, LocalizePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private productService = inject(ProductService);

  categories = this.productService.categories;

  products = this.productService.products;
  loading = this.productService.loading;

  ngOnInit() {
    this.productService.fetchCategories();
    this.productService.fetchPagedProducts();
  }

  onAddToCart(product: Product): void {
    console.log('added to cart: ', product);
  }
}
