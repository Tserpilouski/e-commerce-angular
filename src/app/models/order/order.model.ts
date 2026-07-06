import { CartItem } from '@models/cart/cart-item.model';
import { Money } from '@models/common/money.model';

export interface Order {
  orderNumber: string;
  email: string;
  items: CartItem[];
  total: Money;
  placedAt: string;
  deliveryFrom: string;
  deliveryTo: string;
}
