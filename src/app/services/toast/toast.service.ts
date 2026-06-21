import { Injectable, signal } from '@angular/core';
import { Toast, ToastBase, ToastType } from '@app/shared/components/toast/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, duration?: number) {
    const toast = createMsg(type, message, duration);
    this.toasts.update((list) => [...list, toast]);
    if (duration) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  remove(id: symbol) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}

function createMsg(type: ToastType, message: string, duration?: number): ToastBase {
  return {
    id: Symbol(),
    type,
    message,
    duration,
  };
}
