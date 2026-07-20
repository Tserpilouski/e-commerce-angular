import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Address } from '@shared/models/address.model';

import { AddressCard } from './address-card';

const ADDRESS: Address = {
  id: 'addr-1',
  country: 'US',
  firstName: 'Alex',
  lastName: 'Mercer',
  streetName: 'Tech Boulevard',
  streetNumber: '123',
  additionalStreetInfo: 'Suite 400',
  postalCode: '94107',
  city: 'San Francisco',
};

describe('AddressCard', () => {
  let component: AddressCard;
  let fixture: ComponentFixture<AddressCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressCard);
    fixture.componentRef.setInput('address', ADDRESS);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build display lines from the flat address fields', () => {
    expect(component.recipientName()).toBe('Alex Mercer');
    expect(component.streetLine()).toBe('Tech Boulevard 123, Suite 400');
    expect(component.cityLine()).toBe('San Francisco, 94107 · US');
  });

  it('should skip missing optional parts instead of printing undefined', async () => {
    fixture.componentRef.setInput('address', { country: 'US', city: 'Berlin' });
    await fixture.whenStable();

    expect(component.streetLine()).toBe('');
    expect(component.cityLine()).toBe('Berlin · US');
  });

  it('should emit the address it was given when edited', () => {
    const emitted: Address[] = [];
    component.edit.subscribe((address) => emitted.push(address));

    component.onEdit();

    expect(emitted).toEqual([ADDRESS]);
  });
});
