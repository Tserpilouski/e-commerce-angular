import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressDialogData, AddressDialogResult } from '@pages/profile/dashboard/models/address-dialog.model';
import { Address } from '@shared/models/address.model';

import { AddressEditDialog } from './address-edit-dialog';

const ADDRESS: Address = {
  id: 'addr-1',
  country: 'US',
  firstName: 'Alex',
  lastName: 'Mercer',
  phone: '+1 415 555 0100',
  streetName: 'Tech Boulevard',
  streetNumber: '123',
  additionalStreetInfo: 'Suite 400',
  postalCode: '94107',
  city: 'San Francisco',
};

async function createDialog(data: AddressDialogData) {
  const close = vi.fn();
  const dialogRef = { close } as unknown as MatDialogRef<AddressEditDialog, AddressDialogResult>;

  await TestBed.configureTestingModule({
    imports: [AddressEditDialog],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<AddressEditDialog> = TestBed.createComponent(AddressEditDialog);
  await fixture.whenStable();

  return { component: fixture.componentInstance, close };
}

describe('AddressEditDialog', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('should prefill the form from the injected address', async () => {
    const { component } = await createDialog({ address: ADDRESS, isDefault: true });

    expect(component.isNew).toBe(false);
    expect(component.form.controls.city.value).toBe('San Francisco');
    expect(component.form.controls.streetNumber.value).toBe('123');
    expect(component.form.controls.defaultShipping.value).toBe(true);
  });

  it('should keep the address id and uppercase the country code', async () => {
    const { component, close } = await createDialog({ address: ADDRESS, isDefault: false });

    component.form.controls.country.setValue('us');
    component.form.controls.city.setValue('Oakland');
    component.save();

    expect(close).toHaveBeenCalledWith({
      address: { ...ADDRESS, country: 'US', city: 'Oakland' },
      defaultShipping: false,
    });
  });

  it('should reject a three-letter country code', async () => {
    const { component, close } = await createDialog({ address: ADDRESS, isDefault: false });

    component.form.controls.country.setValue('USA');
    component.save();

    expect(component.form.controls.country.hasError('pattern')).toBe(true);
    expect(close).not.toHaveBeenCalled();
  });

  it('should start blank and invalid in create mode', async () => {
    const { component, close } = await createDialog({ address: null, isDefault: false });

    expect(component.isNew).toBe(true);
    expect(component.form.controls.city.value).toBe('');
    expect(component.form.invalid).toBe(true);

    component.save();
    expect(close).not.toHaveBeenCalled();
  });
});
