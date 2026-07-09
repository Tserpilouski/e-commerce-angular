import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DeliveryInfo } from '@pages/profile/dashboard/models/delivery-info.model';

const DEFAULT_DELIVERY: DeliveryInfo = {
  id: 0,
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

@Component({
  selector: 'ec-address-card',
  imports: [MatIconModule],
  templateUrl: './address-card.html',
  styleUrl: './address-card.scss',
})
export class AddressCard {
  readonly delivery = input<DeliveryInfo>(DEFAULT_DELIVERY);
  readonly edit = output<DeliveryInfo>();

  onEdit(): void {
    this.edit.emit(this.delivery());
  }

  readonly recipientName = computed(() => {
    const { firstName, lastName } = this.delivery().recipient;
    return `${firstName} ${lastName}`;
  });

  readonly streetLine = computed(() => {
    const { street, houseNumber, apartmentNumber } = this.delivery().address;
    const base = `${street} ${houseNumber}`;
    return apartmentNumber ? `${base}, ${apartmentNumber}` : base;
  });

  readonly cityLine = computed(() => {
    const { city, postalCode } = this.delivery().address;
    return `${city}, ${postalCode}`;
  });
}
