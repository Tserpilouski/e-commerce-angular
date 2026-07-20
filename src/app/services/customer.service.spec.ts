import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Customer } from '@shared/models/customer.model';
import { ApiClientService } from './api-client.service';
import { AuthService } from './auth.service';
import { CustomerService } from './customer.service';

const CUSTOMER: Customer = {
  id: 'customer-1',
  version: 7,
  email: 'alex@example.com',
  firstName: 'Alex',
  lastName: 'Mercer',
  addresses: [{ id: 'addr-1', country: 'US', city: 'San Francisco' }],
  defaultShippingAddressId: 'addr-1',
};

describe('CustomerService', () => {
  let service: CustomerService;
  let currentUser: ReturnType<typeof signal<Customer | null>>;
  let ecomFetchWithState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    currentUser = signal<Customer | null>(CUSTOMER);
    ecomFetchWithState = vi.fn().mockResolvedValue({ ...CUSTOMER, version: 8 });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { currentUser } },
        { provide: ApiClientService, useValue: { ecomFetchWithState } },
      ],
    });

    service = TestBed.inject(CustomerService);
  });

  it('should expose addresses from the signed-in customer', () => {
    expect(service.addresses()).toEqual(CUSTOMER.addresses);
    expect(service.defaultShippingAddressId()).toBe('addr-1');
  });

  it('should send one action per changed profile field', async () => {
    await service.updateProfile({
      firstName: 'Alexandra',
      lastName: 'Mercer',
      email: 'alex@example.com',
      companyName: 'Acme',
    });

    expect(ecomFetchWithState.mock.calls[0][3].body).toEqual({
      version: 7,
      actions: [
        { action: 'setFirstName', firstName: 'Alexandra' },
        { action: 'setCompanyName', companyName: 'Acme' },
      ],
    });
  });

  it('should skip the request entirely when nothing changed', async () => {
    const result = await service.updateProfile({ firstName: 'Alex', lastName: 'Mercer' });

    expect(ecomFetchWithState).not.toHaveBeenCalled();
    expect(result).toBe(CUSTOMER);
  });

  it('should treat a cleared field as unset and trim whitespace', async () => {
    await service.updateProfile({ firstName: '  Alex  ', lastName: '   ' });

    expect(ecomFetchWithState.mock.calls[0][3].body.actions).toEqual([{ action: 'setLastName', lastName: undefined }]);
  });

  it('should change the email but never unset it', async () => {
    await service.updateProfile({ email: 'new@example.com' });
    expect(ecomFetchWithState.mock.calls[0][3].body.actions).toEqual([
      { action: 'changeEmail', email: 'new@example.com' },
    ]);

    ecomFetchWithState.mockClear();
    await service.updateProfile({ email: '' });
    expect(ecomFetchWithState).not.toHaveBeenCalled();
  });

  it('should send the current version with a changeAddress action', async () => {
    await service.updateAddress('addr-1', { country: 'US', city: 'Oakland' });

    const [path, , , options] = ecomFetchWithState.mock.calls[0];
    expect(path).toBe('customers/customer-1');
    expect(options.method).toBe('POST');
    expect(options.body).toEqual({
      version: 7,
      actions: [{ action: 'changeAddress', addressId: 'addr-1', address: { country: 'US', city: 'Oakland' } }],
    });
  });

  it('should store the returned customer so the next update uses the new version', async () => {
    await service.removeAddress('addr-1');

    expect(currentUser()?.version).toBe(8);
  });

  it('should key a new address and reference that key when making it default', async () => {
    await service.addAddress({ country: 'US', city: 'Oakland' }, { defaultShipping: true });

    const { actions } = ecomFetchWithState.mock.calls[0][3].body;
    const key = actions[0].address.key;

    expect(key).toBeTruthy();
    expect(actions).toEqual([
      { action: 'addAddress', address: { country: 'US', city: 'Oakland', key } },
      { action: 'setDefaultShippingAddress', addressKey: key },
    ]);
  });

  it('should not call the API when nobody is signed in', async () => {
    currentUser.set(null);

    await expect(service.addAddress({ country: 'US' })).rejects.toThrow('no customer is signed in');
    expect(ecomFetchWithState).not.toHaveBeenCalled();
  });
});
