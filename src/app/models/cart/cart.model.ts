import { Money } from '@models/common/money.model';
import { CartItem } from './cart-item.model';

export interface Cart {
  id: string;
  items: CartItem[];
  discountCode?: string;
  discountAmount?: Money;
  shippingCost: Money;
  subtotal: Money;
  estimatedTax: Money;
  total: Money;
}
