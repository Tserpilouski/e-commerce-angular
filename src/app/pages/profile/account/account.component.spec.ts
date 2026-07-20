import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@services/auth.service';
import { CustomerService } from '@services/customer.service';
import { ToastService } from '@services/toast/toast.service';
import { ToastType } from '@shared/components/toast/models/toast.model';
import { Customer } from '@shared/models/customer.model';

import { Account } from './account.component';

const CUSTOMER: Customer = {
  id: 'customer-1',
  version: 3,
  email: 'alex@example.com',
  firstName: 'Alex',
  lastName: 'Mercer',
  companyName: 'Acme',
  addresses: [],
};

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;
  let updateProfile: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateProfile = vi.fn().mockResolvedValue(CUSTOMER);
    show = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        {
          provide: AuthService,
          useValue: { isAuthenticated: signal(true), currentUser: signal(CUSTOMER) },
        },
        {
          provide: CustomerService,
          useValue: { updateProfile, loading: signal(false), error: signal<string | null>(null) },
        },
        { provide: ToastService, useValue: { show } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should prefill the form from the signed-in customer', () => {
    expect(component.form.controls.firstName.value).toBe('Alex');
    expect(component.form.controls.lastName.value).toBe('Mercer');
    expect(component.form.pristine).toBe(true);
  });

  it('should not send fields the form does not manage', async () => {
    component.form.controls.firstName.setValue('Alexandra');

    await component.save();

    expect(Object.keys(updateProfile.mock.calls[0][0]).sort()).toEqual([
      'dateOfBirth',
      'firstName',
      'lastName',
      'middleName',
      'salutation',
      'title',
    ]);
  });

  it('should submit the whole form and mark it pristine again', async () => {
    component.form.controls.firstName.setValue('Alexandra');
    component.form.markAsDirty();

    await component.save();

    expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Alexandra', lastName: 'Mercer' }));
    expect(component.form.pristine).toBe(true);
    expect(show).toHaveBeenCalledWith(ToastType.Success, expect.any(String), expect.any(Number));
  });

  it('should show the failure in a toast and keep the form dirty', async () => {
    updateProfile.mockRejectedValue(new Error('HTTP Error (409): version mismatch'));
    component.form.controls.firstName.setValue('Alexandra');
    component.form.markAsDirty();

    await component.save();

    expect(show).toHaveBeenCalledWith(ToastType.Error, 'HTTP Error (409): version mismatch', expect.any(Number));
    expect(component.form.pristine).toBe(false);
  });

  it('should not submit an invalid form', async () => {
    component.form.controls.firstName.setValue('');

    await component.save();

    expect(updateProfile).not.toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });

  it('should restore the customer values on discard', () => {
    component.form.controls.firstName.setValue('Typo');
    component.resetFromCustomer();

    expect(component.form.controls.firstName.value).toBe('Alex');
    expect(component.form.pristine).toBe(true);
  });
});
