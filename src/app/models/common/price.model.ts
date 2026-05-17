import { Money } from './money.model';

export interface Price {
  id: string;
  value: Money;
  key?: string;
}
