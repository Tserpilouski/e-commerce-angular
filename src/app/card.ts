import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  badge?: string;
}

@Component({
  selector: 'app-card',
  imports: [CommonModule],
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
