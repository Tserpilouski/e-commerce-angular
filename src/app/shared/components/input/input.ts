import { Component, forwardRef, input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

type InputStatus = 'default' | 'success' | 'error';

@Component({
  selector: 'ec-input',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  host: {
    '[attr.data-status]': 'status()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  type = input<string>('text');
  placeholder = input<string>('');
  label = input<string>('');
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  status = input<InputStatus>('default');

  value = '';
  isDisabled = false;

  private onChange = (_: string) => {};
  onTouched = () => {};

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(value: string) {
    this.value = value ?? '';
  }

  registerOnChange(fn: (_: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
