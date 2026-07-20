import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@services/auth.service';
import { CustomerService } from '@services/customer.service';
import { ToastService } from '@services/toast/toast.service';
import { InputComponent } from '@shared/components/input/input.component';
import { ToastType } from '@shared/components/toast/models/toast.model';

@Component({
  selector: 'ec-account',
  imports: [ReactiveFormsModule, InputComponent, MatButtonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class Account {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly loading = this.customerService.loading;

  readonly form = this.formBuilder.nonNullable.group({
    salutation: [''],
    title: [''],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    dateOfBirth: [''],
  });

  constructor() {
    this.resetFromCustomer();
  }

  statusOf(control: AbstractControl): 'error' | 'default' {
    return control.invalid && control.touched ? 'error' : 'default';
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      await this.customerService.updateProfile(this.form.getRawValue());
      this.form.markAsPristine();
      this.toastService.show(ToastType.Success, 'Your details have been saved.', 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save your details.';
      this.toastService.show(ToastType.Error, message, 6000);
    }
  }

  resetFromCustomer(): void {
    const customer = this.authService.currentUser();

    this.form.reset({
      salutation: customer?.salutation ?? '',
      title: customer?.title ?? '',
      firstName: customer?.firstName ?? '',
      middleName: customer?.middleName ?? '',
      lastName: customer?.lastName ?? '',
      dateOfBirth: customer?.dateOfBirth ?? '',
    });
  }
}
