import { Customer } from './customer.model';

export type CustomerProfile = Partial<
  Pick<
    Customer,
    'firstName' | 'lastName' | 'middleName' | 'title' | 'salutation' | 'dateOfBirth' | 'companyName' | 'vatId' | 'email'
  >
>;
