import { Injectable, signal } from '@angular/core';
import { Order } from '@models/order/order.model';
import { Cart } from '@models/cart/cart.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly lastOrder = signal<Order | null>(null);

  placeOrder(cart: Cart, email: string): Order {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() + 3);
    const to = new Date(now);
    to.setDate(to.getDate() + 5);
    const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const order: Order = {
      orderNumber: 'RS-' + Math.floor(10000 + Math.random() * 90000),
      email,
      items: cart.items,
      total: cart.total,
      placedAt: now.toISOString(),
      deliveryFrom: format(from),
      deliveryTo: format(to),
    };

    this.lastOrder.set(order);
    return order;
  }
}
