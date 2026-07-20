import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Address } from '@shared/models/address.model';

@Component({
  selector: 'ec-address-card',
  imports: [MatIconModule],
  templateUrl: './address-card.html',
  styleUrl: './address-card.scss',
})
export class AddressCard {
  readonly address = input.required<Address>();
  readonly isDefault = input(false);

  readonly edit = output<Address>();
  readonly remove = output<Address>();

  readonly recipientName = computed(() => {
    const { firstName, lastName } = this.address();
    return [firstName, lastName].filter(Boolean).join(' ');
  });

  readonly streetLine = computed(() => {
    const { streetName, streetNumber, additionalStreetInfo } = this.address();
    const street = [streetName, streetNumber].filter(Boolean).join(' ');
    return [street, additionalStreetInfo].filter(Boolean).join(', ');
  });

  readonly cityLine = computed(() => {
    const { city, postalCode, country } = this.address();
    return [[city, postalCode].filter(Boolean).join(', '), country].filter(Boolean).join(' · ');
  });

  onEdit(): void {
    this.edit.emit(this.address());
  }

  onRemove(): void {
    this.remove.emit(this.address());
  }
}
