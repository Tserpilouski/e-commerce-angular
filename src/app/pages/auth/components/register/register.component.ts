import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { InputComponent } from '@shared/components/input/input.component';

@Component({
  selector: 'ec-auth-register',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly registerSuccess = output<string>();

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isLoading = signal(false);
  readonly authError = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly signUpForm: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (group: FormGroup) => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
      },
    },
  );

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update((v) => !v);
  }

  async onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authError.set(null);
    this.successMessage.set(null);

    const { firstName, lastName, email, password } = this.signUpForm.value;

    try {
      await this.authService.register({ firstName, lastName, email, password });
      this.successMessage.set('Account created successfully! Prefilling sign in...');

      // Delay before emitting success to allow the success alert to display
      setTimeout(() => {
        this.registerSuccess.emit(email);
        this.signUpForm.reset();
        this.successMessage.set(null);
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      this.authError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
