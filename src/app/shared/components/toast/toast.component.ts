import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '@app/services/toast/toast.service';
import { ToastType } from './models/toast.model';

@Component({
  selector: 'ec-toast',
  imports: [MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class Toast {
  toastService = inject(ToastService);

  readonly toastLabels: Record<ToastType, string> = {
    [ToastType.Success]: 'Success',
    [ToastType.Error]: 'Error',
    [ToastType.Warning]: 'Warning',
    [ToastType.Info]: 'Info',
  };

  readonly toastIcons: Record<ToastType, string> = {
    [ToastType.Success]: 'check_circle',
    [ToastType.Error]: 'error',
    [ToastType.Warning]: 'warning',
    [ToastType.Info]: 'info',
  };
}
