import { Component, inject } from '@angular/core';
import { ToastService } from '@app/services/toast/toast.service';
import { ToastType } from './models/toast.model';

@Component({
  selector: 'ec-toast',
  imports: [],
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
}
