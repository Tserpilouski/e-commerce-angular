import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '@services/toast/toast.service';
import { ToastType } from '@shared/components/toast/models/toast.model';

export const authLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  console.log(`[HTTP] ${req.method} ${req.url}`);

  return next(req).pipe(
    tap((event) => {
      if ('status' in event) {
        console.log(`[HTTP] ${req.method} ${req.url} → ${(event as { status: number }).status}`);
      }
    }),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const status = error.status;
        let message: string;

        if (status === 0) {
          message = 'Network error — please check your connection.';
        } else if (status === 401) {
          message = 'Unauthorised — please log in again.';
        } else if (status === 403) {
          message = 'Forbidden — you do not have permission to do that.';
        } else if (status === 404) {
          message = `Resource not found (404): ${req.url.split('/').pop()}`;
        } else if (status >= 500) {
          message = `Server error (${status}) — please try again later.`;
        } else {
          const errorText =
            typeof error.error === 'object' && error.error !== null
              ? ((error.error as { message?: string }).message ?? JSON.stringify(error.error))
              : String(error.message);
          message = `Request failed (${status}): ${errorText}`;
        }

        toastService.show(ToastType.Error, message, 6000);
      }

      return throwError(() => error);
    }),
  );
};
