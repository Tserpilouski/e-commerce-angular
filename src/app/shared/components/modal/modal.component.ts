import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'ec-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly open = input<boolean>(false);
  readonly title = input<string>('');
  readonly closeOnOverlay = input<boolean>(true);

  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
