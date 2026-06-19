import { Money } from '../common/money.model';

export interface CartItem {
  productId: string;
  productKey: string;
  name: string;
  variant: string;
  quantity: number;
  price: Money;
  imageUrl?: string;
}
