import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart';
import { Product } from '../../models/products/product.model';

@Component({
  selector: 'ec-home',
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categories = signal([{ name: 'Laptops' }, { name: 'Desktops' }, { name: 'Audio' }, { name: 'Components' }]);

  products = this.productService.products;
  loading = this.productService.loading;

  ngOnInit() {
    this.productService.fetchProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addProduct(product);
  }
}
