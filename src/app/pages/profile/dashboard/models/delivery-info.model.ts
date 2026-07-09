import { Address } from './address.model';
import { Recipient } from './recipient.model';

export interface DeliveryInfo {
  id: number;
  label: string;
  isDefault: boolean;
  address: Address;
  recipient: Recipient;
}
