import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeliveryInfo } from '@pages/profile/dashboard/models/delivery-info.model';

const BLANK_DELIVERY: DeliveryInfo = {
  id: 0,
  label: '',
  isDefault: false,
  recipient: { firstName: '', lastName: '', phone: '' },
  address: {
    country: '',
    city: '',
    postalCode: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
  },
};

@Component({
  selector: 'ec-address-edit-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './address-edit-dialog.html',
  styleUrl: './address-edit-dialog.scss',
})
export class AddressEditDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<AddressEditDialog, DeliveryInfo>>(MatDialogRef);
  private readonly data = inject<DeliveryInfo | null>(MAT_DIALOG_DATA);

  readonly isNew = this.data === null;

  private readonly delivery = this.data ?? BLANK_DELIVERY;

  readonly form = this.formBuilder.nonNullable.group({
    label: [this.delivery.label, Validators.required],
    recipient: this.formBuilder.nonNullable.group({
      firstName: [this.delivery.recipient.firstName, Validators.required],
      lastName: [this.delivery.recipient.lastName, Validators.required],
      phone: [this.delivery.recipient.phone, Validators.required],
    }),
    address: this.formBuilder.nonNullable.group({
      country: [this.delivery.address.country, Validators.required],
      city: [this.delivery.address.city, Validators.required],
      postalCode: [this.delivery.address.postalCode, Validators.required],
      street: [this.delivery.address.street, Validators.required],
      houseNumber: [this.delivery.address.houseNumber, Validators.required],
      apartmentNumber: [this.delivery.address.apartmentNumber ?? ''],
    }),
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({ ...this.delivery, ...this.form.getRawValue() });
  }
}
