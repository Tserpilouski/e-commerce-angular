import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { InputComponent } from '@shared/components/input/input.component';

@Component({
  selector: 'ec-auth-login',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly loginSuccess = output<void>();
  readonly prefilledEmail = input<string | null>(null);

  constructor() {
    effect(() => {
      const email = this.prefilledEmail();
      if (email) {
        this.signInForm.patchValue({ email });
      }
    });
  }

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly authError = signal<string | null>(null);

  readonly signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.showPassword.update((v) => !v);
  }

  async onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authError.set(null);

    const { email, password } = this.signInForm.value;

    try {
      await this.authService.login(email, password);
      this.loginSuccess.emit();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.';
      this.authError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
