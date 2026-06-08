import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products/product.model';

@Component({
  selector: 'ec-home',
  imports: [CardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private productService = inject(ProductService);

  categories = signal([{ name: 'Laptops' }, { name: 'Desktops' }, { name: 'Audio' }, { name: 'Components' }]);

  products = this.productService.products;
  loading = this.productService.loading;

  ngOnInit() {
    this.productService.fetchProducts();
  }

  onAddToCart(product: Product): void {
    console.log('added to cart: ', product);
  }
}
