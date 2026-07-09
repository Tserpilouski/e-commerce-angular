import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { OrderStatus } from '@pages/profile/dashboard/models/order-status.model';

@Component({
  selector: 'ec-recent-orders-card',
  imports: [CurrencyPipe],
  templateUrl: './recent-orders-card.html',
  styleUrl: './recent-orders-card.scss',
})
export class RecentOrdersCard {
  readonly orderNumber = input('RS-90210');
  readonly total = input(1249);
  readonly placedOn = input('Oct 24, 2024');
  readonly status = input<OrderStatus>('Processing');

  readonly statusClass = computed(() => `status--${this.status().toLowerCase()}`);
}
