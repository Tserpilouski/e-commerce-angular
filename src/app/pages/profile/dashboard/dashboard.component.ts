import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@services/auth.service';
import { CustomerService } from '@services/customer.service';
import { Address } from '@shared/models/address.model';
import { AddressCard } from './components/address-card/address-card';
import { AddressEditDialog } from './components/address-edit-dialog/address-edit-dialog';
import { RecentOrdersCard } from './components/recent-orders-card/recent-orders-card';
import { AddressDialogData, AddressDialogResult } from './models/address-dialog.model';
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
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(CustomerService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly addresses = this.addressService.addresses;
  readonly defaultShippingAddressId = this.addressService.defaultShippingAddressId;
  readonly loading = this.addressService.loading;
  readonly error = this.addressService.error;

  readonly userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.firstName || user?.email || 'there';
  });

  readonly recentOrders: RecentOrder[] = [
    { orderNumber: 'RS-90210', total: 1249, placedOn: 'Oct 24, 2024', status: 'Processing' },
    { orderNumber: 'RS-88302', total: 89.99, placedOn: 'Sep 12, 2024', status: 'Delivered' },
  ];

  isDefault(address: Address): boolean {
    return !!address.id && address.id === this.defaultShippingAddressId();
  }

  onEdit(address: Address): void {
    this.openDialog({ address, isDefault: this.isDefault(address) }).subscribe(async (result) => {
      if (!result || !address.id) {
        return;
      }

      await this.addressService.updateAddress(address.id, result.address);

      if (result.defaultShipping !== this.isDefault(address)) {
        await this.addressService.setDefaultShippingAddress(result.defaultShipping ? address.id : undefined);
      }
    });
  }

  onAdd(): void {
    this.openDialog({ address: null, isDefault: false }).subscribe(async (result) => {
      if (!result) {
        return;
      }

      await this.addressService.addAddress(result.address, {
        defaultShipping: result.defaultShipping,
      });
    });
  }

  async onRemove(address: Address): Promise<void> {
    if (!address.id) {
      return;
    }

    await this.addressService.removeAddress(address.id);
  }

  private openDialog(data: AddressDialogData) {
    return this.dialog
      .open<AddressEditDialog, AddressDialogData, AddressDialogResult>(AddressEditDialog, {
        data,
        width: '560px',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef));
  }
}
