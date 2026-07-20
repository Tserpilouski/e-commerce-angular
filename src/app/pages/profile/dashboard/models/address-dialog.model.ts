import { Address } from '@shared/models/address.model';

export interface AddressDialogData {
  address: Address | null;
  isDefault: boolean;
}

export interface AddressDialogResult {
  address: Address;
  defaultShipping: boolean;
}
