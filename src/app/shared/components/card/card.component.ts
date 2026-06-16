import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@models/products/product.model';
import { ProductImagePipe } from '@shared/pipes/product-image.pipe';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'ec-card',
  imports: [CommonModule, ProductImagePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product());
  }
}
