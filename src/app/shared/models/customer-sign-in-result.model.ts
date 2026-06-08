import { Customer } from './customer.model';

export interface CustomerSignInResult {
  customer: Customer;
  cart?: unknown;
}
