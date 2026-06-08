import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/products/product.model';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'ec-card',
  imports: [CommonModule, ProductImagePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  product = input.required<Product>();
  addtoCard = output<Product>();

  onAddToCard() {
    this.addtoCard.emit(this.product());
  }
}
