import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ec-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly size = input<number | string>(32);
  readonly color = input<string>('currentColor');

  readonly sizeValue = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : s;
  });
}
