import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressDialogData, AddressDialogResult } from '@pages/profile/dashboard/models/address-dialog.model';
import { Address } from '@shared/models/address.model';

const BLANK_ADDRESS: Address = {
  country: '',
  firstName: '',
  lastName: '',
  phone: '',
  streetName: '',
  streetNumber: '',
  additionalStreetInfo: '',
  postalCode: '',
  city: '',
};

@Component({
  selector: 'ec-address-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './address-edit-dialog.html',
  styleUrl: './address-edit-dialog.scss',
})
export class AddressEditDialog {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<AddressEditDialog, AddressDialogResult>>(MatDialogRef);
  private readonly data = inject<AddressDialogData>(MAT_DIALOG_DATA);

  readonly isNew = this.data.address === null;

  private readonly address = this.data.address ?? BLANK_ADDRESS;

  readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.address.firstName ?? '', Validators.required],
    lastName: [this.address.lastName ?? '', Validators.required],
    phone: [this.address.phone ?? ''],
    country: [this.address.country, [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)]],
    city: [this.address.city ?? '', Validators.required],
    postalCode: [this.address.postalCode ?? '', Validators.required],
    streetName: [this.address.streetName ?? '', Validators.required],
    streetNumber: [this.address.streetNumber ?? ''],
    additionalStreetInfo: [this.address.additionalStreetInfo ?? ''],
    defaultShipping: [this.data.isDefault],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { defaultShipping, country, ...fields } = this.form.getRawValue();

    this.dialogRef.close({
      address: { ...this.address, ...fields, country: country.toUpperCase() },
      defaultShipping,
    });
  }
}
