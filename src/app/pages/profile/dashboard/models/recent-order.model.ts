import { OrderStatus } from './order-status.model';

export interface RecentOrder {
  orderNumber: string;
  total: number;
  placedOn: string;
  status: OrderStatus;
}
