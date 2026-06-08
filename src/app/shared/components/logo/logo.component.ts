import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ec-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  readonly size = input<number | string>(32);
  readonly color = input<string>('currentColor');

  readonly sizeValue = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : s;
  });
}
