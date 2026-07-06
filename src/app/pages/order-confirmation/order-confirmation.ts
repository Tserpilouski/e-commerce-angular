import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';

@Component({
  selector: 'ec-order-confirmation',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
})
export class OrderConfirmationComponent {
  private orderService = inject(OrderService);

  readonly order = this.orderService.lastOrder;

  formatPrice(centAmount: number, fractionDigits: number): number {
    return centAmount / Math.pow(10, fractionDigits);
  }
}
