import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '@models/cart/cart-item.model';

@Component({
  selector: 'ec-cart-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss',
})
export class CartCardComponent {
  readonly fallbackImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';

  item = input.required<CartItem>();
  quantityChange = output<number>();
  remove = output<void>();

  formatPrice(centAmount: number, fractionDigits: number): number {
    return centAmount / Math.pow(10, fractionDigits);
  }

  decrease(): void {
    const quantity = this.item().quantity;
    if (quantity > 1) {
      this.quantityChange.emit(quantity - 1);
    }
  }

  increase(): void {
    this.quantityChange.emit(this.item().quantity + 1);
  }

  onRemove(): void {
    this.remove.emit();
  }
}
