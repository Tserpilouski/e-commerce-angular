import { Address } from './address.model';

export type CustomerUpdateAction =
  | { action: 'setFirstName'; firstName?: string }
  | { action: 'setLastName'; lastName?: string }
  | { action: 'setMiddleName'; middleName?: string }
  | { action: 'setTitle'; title?: string }
  | { action: 'setSalutation'; salutation?: string }
  | { action: 'setDateOfBirth'; dateOfBirth?: string }
  | { action: 'setCompanyName'; companyName?: string }
  | { action: 'setVatId'; vatId?: string }
  | { action: 'changeEmail'; email: string }
  | { action: 'addAddress'; address: Address }
  | { action: 'changeAddress'; addressId: string; address: Address }
  | { action: 'removeAddress'; addressId: string }
  | { action: 'setDefaultShippingAddress'; addressId?: string; addressKey?: string }
  | { action: 'setDefaultBillingAddress'; addressId?: string; addressKey?: string }
  | { action: 'addShippingAddressId'; addressId?: string; addressKey?: string }
  | { action: 'addBillingAddressId'; addressId?: string; addressKey?: string };
