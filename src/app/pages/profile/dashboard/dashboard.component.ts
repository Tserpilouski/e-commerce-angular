import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AddressCard } from './components/address-card/address-card';
import { AddressEditDialog } from './components/address-edit-dialog/address-edit-dialog';
import { RecentOrdersCard } from './components/recent-orders-card/recent-orders-card';
import { DeliveryInfo } from './models/delivery-info.model';
import { RecentOrder } from './models/recent-order.model';

@Component({
  selector: 'ec-dashboard',
  imports: [MatIconModule, AddressCard, RecentOrdersCard],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly userName = 'Alex';

  readonly recentOrders: RecentOrder[] = [
    { orderNumber: 'RS-90210', total: 1249, placedOn: 'Oct 24, 2024', status: 'Processing' },
    { orderNumber: 'RS-88302', total: 89.99, placedOn: 'Sep 12, 2024', status: 'Delivered' },
  ];

  readonly addresses = signal<DeliveryInfo[]>([
    {
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
    },
    {
      id: 2,
      label: 'Work',
      isDefault: false,
      recipient: { firstName: 'Alex', lastName: 'Mercer', phone: '+1 415 555 0142' },
      address: {
        country: 'USA',
        city: 'San Francisco',
        postalCode: 'CA 94105',
        street: 'Market Street',
        houseNumber: '500',
        apartmentNumber: 'Floor 12',
      },
    },
  ]);

  onEdit(delivery: DeliveryInfo): void {
    this.openDialog(delivery).subscribe((updated) => {
      if (!updated) {
        return;
      }

      this.addresses.update((addresses) => addresses.map((address) => (address.id === updated.id ? updated : address)));
    });
  }

  onAdd(): void {
    this.openDialog(null).subscribe((created) => {
      if (!created) {
        return;
      }

      this.addresses.update((addresses) => [...addresses, { ...created, id: this.nextId(addresses) }]);
    });
  }

  private openDialog(delivery: DeliveryInfo | null): Observable<DeliveryInfo | undefined> {
    return this.dialog
      .open<AddressEditDialog, DeliveryInfo | null, DeliveryInfo>(AddressEditDialog, {
        data: delivery,
        width: '520px',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  private nextId(addresses: readonly DeliveryInfo[]): number {
    return addresses.reduce((maxId, address) => Math.max(maxId, address.id), 0) + 1;
  }
}
