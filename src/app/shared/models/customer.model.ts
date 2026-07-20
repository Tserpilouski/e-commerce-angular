import { Address } from './address.model';

export interface Customer {
  id: string;
  version: number;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  salutation?: string;
  dateOfBirth?: string;
  companyName?: string;
  vatId?: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
}
