import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models/products/product.model';
import { ProductImagePipe } from './shared/pipes/product-image.pipe';

@Component({
  selector: 'ec-card',
  imports: [CommonModule, ProductImagePipe],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  product = input.required<Product>();
  addtoCard = output<Product>();

  onAddToCard() {
    this.addtoCard.emit(this.product());
  }
}
