import { computed, inject, Injectable, signal } from '@angular/core';
import { Address } from '@shared/models/address.model';
import { Customer } from '@shared/models/customer.model';
import { CustomerProfile } from '@shared/models/customer-profile.model';
import { CustomerUpdateAction } from '@shared/models/customer-update-action.model';
import { ApiClientService } from './api-client.service';
import { AuthService } from './auth.service';

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiClient = inject(ApiClientService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly customer = this.authService.currentUser;

  readonly addresses = computed<Address[]>(() => this.customer()?.addresses ?? []);

  readonly defaultShippingAddressId = computed(() => this.customer()?.defaultShippingAddressId);

  readonly defaultBillingAddressId = computed(() => this.customer()?.defaultBillingAddressId);

  async updateProfile(profile: CustomerProfile): Promise<Customer> {
    const customer = this.requireCustomer();
    const actions = this.buildProfileActions(customer, profile);

    if (!actions.length) {
      return customer;
    }

    return this.applyActions(actions);
  }

  async addAddress(
    address: Address,
    options?: { defaultShipping?: boolean; defaultBilling?: boolean },
  ): Promise<Customer> {
    const key = address.key ?? crypto.randomUUID();
    const actions: CustomerUpdateAction[] = [{ action: 'addAddress', address: { ...address, key } }];

    if (options?.defaultShipping) {
      actions.push({ action: 'setDefaultShippingAddress', addressKey: key });
    }
    if (options?.defaultBilling) {
      actions.push({ action: 'setDefaultBillingAddress', addressKey: key });
    }

    return this.applyActions(actions);
  }

  async updateAddress(addressId: string, address: Address): Promise<Customer> {
    return this.applyActions([{ action: 'changeAddress', addressId, address }]);
  }

  async removeAddress(addressId: string): Promise<Customer> {
    return this.applyActions([{ action: 'removeAddress', addressId }]);
  }

  async setDefaultShippingAddress(addressId: string | undefined): Promise<Customer> {
    return this.applyActions([{ action: 'setDefaultShippingAddress', addressId }]);
  }

  async setDefaultBillingAddress(addressId: string | undefined): Promise<Customer> {
    return this.applyActions([{ action: 'setDefaultBillingAddress', addressId }]);
  }

  async applyActions(actions: CustomerUpdateAction[]): Promise<Customer> {
    const customer = this.requireCustomer();

    const updated = await this.apiClient.ecomFetchWithState<Customer>(
      `customers/${customer.id}`,
      this.loading,
      this.error,
      {
        method: 'POST',
        body: { version: customer.version, actions },
      },
    );

    this.authService.currentUser.set(updated);
    return updated;
  }

  private buildProfileActions(customer: Customer, profile: CustomerProfile): CustomerUpdateAction[] {
    const actions: CustomerUpdateAction[] = [];

    const push = <K extends keyof CustomerProfile>(
      field: K,
      build: (value: string | undefined) => CustomerUpdateAction,
    ): void => {
      if (!(field in profile)) {
        return;
      }

      const next = trimToUndefined(profile[field]);

      if (next !== (customer[field] ?? undefined)) {
        actions.push(build(next));
      }
    };

    push('firstName', (firstName) => ({ action: 'setFirstName', firstName }));
    push('lastName', (lastName) => ({ action: 'setLastName', lastName }));
    push('middleName', (middleName) => ({ action: 'setMiddleName', middleName }));
    push('title', (title) => ({ action: 'setTitle', title }));
    push('salutation', (salutation) => ({ action: 'setSalutation', salutation }));
    push('dateOfBirth', (dateOfBirth) => ({ action: 'setDateOfBirth', dateOfBirth }));
    push('companyName', (companyName) => ({ action: 'setCompanyName', companyName }));
    push('vatId', (vatId) => ({ action: 'setVatId', vatId }));

    const email = trimToUndefined(profile.email);
    if (email && email !== customer.email) {
      actions.push({ action: 'changeEmail', email });
    }

    return actions;
  }

  private requireCustomer(): Customer {
    const customer = this.customer();

    if (!customer) {
      throw new Error('Cannot update the profile: no customer is signed in.');
    }

    return customer;
  }
}
