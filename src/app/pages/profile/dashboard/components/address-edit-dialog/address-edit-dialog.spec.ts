import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeliveryInfo } from '@pages/profile/dashboard/components/address-card/address-card';

import { AddressEditDialog } from './address-edit-dialog';

const DELIVERY: DeliveryInfo = {
  id: 1,
  label: 'Home',
  isDefault: true,
  recipient: { firstName: 'Alex', lastName: 'Mercer', phone: '+1 415 555 0100' },
  address: {
    country: 'USA',
    city: 'San Francisco',
    postalCode: 'CA 94107',
    street: 'Tech Boulevard',
    houseNumber: '123',
    apartmentNumber: 'Suite 400',
  },
};

describe('AddressEditDialog', () => {
  let component: AddressEditDialog;
  let fixture: ComponentFixture<AddressEditDialog>;
  let close: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    close = vi.fn();
    const dialogRef = { close } as unknown as MatDialogRef<AddressEditDialog, DeliveryInfo>;

    await TestBed.configureTestingModule({
      imports: [AddressEditDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: DELIVERY },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill the form from the injected delivery', () => {
    expect(component.form.getRawValue()).toEqual({
      label: DELIVERY.label,
      recipient: DELIVERY.recipient,
      address: { ...DELIVERY.address, apartmentNumber: 'Suite 400' },
    });
  });

  it('should keep isDefault and close with the edited delivery', () => {
    component.form.controls.address.controls.city.setValue('Oakland');
    component.save();

    expect(close).toHaveBeenCalledWith({
      ...DELIVERY,
      address: { ...DELIVERY.address, city: 'Oakland' },
    });
  });

  it('should not close when the form is invalid', () => {
    component.form.controls.label.setValue('');
    component.save();

    expect(close).not.toHaveBeenCalled();
  });
});

describe('AddressEditDialog in create mode', () => {
  let component: AddressEditDialog;
  let fixture: ComponentFixture<AddressEditDialog>;

  beforeEach(async () => {
    const dialogRef = { close: vi.fn() } as unknown as MatDialogRef<AddressEditDialog, DeliveryInfo>;

    await TestBed.configureTestingModule({
      imports: [AddressEditDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should start blank and invalid when no delivery is passed', () => {
    expect(component.isNew).toBe(true);
    expect(component.form.controls.label.value).toBe('');
    expect(component.form.invalid).toBe(true);
  });
});
