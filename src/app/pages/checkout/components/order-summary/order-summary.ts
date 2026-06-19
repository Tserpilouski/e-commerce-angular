import { Component, inject, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../../services/cart';
import { Button } from '../../../../button/button';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'ec-order-summary',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, Button, InputComponent, MatIconModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummaryComponent {
  private cartService = inject(CartService);

  readonly orderPlaced = output<void>();
  readonly cart = this.cartService.cart;
  readonly discountControl = new FormControl('');
  readonly discountError = signal<string>('');
  readonly discountSuccess = signal<boolean>(false);

  formatPrice(centAmount: number, fractionDigits: number): number {
    return centAmount / Math.pow(10, fractionDigits);
  }

  applyDiscount(): void {
    const code = this.discountControl.value?.trim() ?? '';
    if (!code) return;

    const success = this.cartService.applyDiscount(code);
    if (success) {
      this.discountError.set('');
      this.discountSuccess.set(true);
    } else {
      this.discountError.set('Invalid discount code');
      this.discountSuccess.set(false);
    }
  }

  placeOrder(): void {
    this.orderPlaced.emit();
  }
}
