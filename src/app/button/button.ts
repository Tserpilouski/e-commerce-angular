import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ec-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  label = input.required<string>();
  variant = input.required<'primary' | 'outline'>();
  disabled = input<boolean>(false);
  btnClick = output<void>();

  ClickOn() {
    if (!this.disabled()) {
      this.btnClick.emit();
    }
  }
}
