import { inject, Injectable, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  body?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);

  async ecomFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    const method = options?.method ?? 'GET';
    const request$ = this.http
      .request<T>(method, path, {
        headers: options?.headers,
        params: options?.params,
        body: options?.body,
      })
      .pipe(
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            const errorText = typeof err.error === 'object' ? JSON.stringify(err.error) : err.error || err.message;
            return throwError(() => new Error(`HTTP Error (${err.status}): ${errorText}`));
          }
          return throwError(() => err);
        }),
      );
    return firstValueFrom(request$);
  }

  async ecomFetchWithState<T>(
    path: string,
    loading?: WritableSignal<boolean>,
    error?: WritableSignal<string | null>,
    options?: FetchOptions,
  ): Promise<T> {
    loading?.set(true);
    error?.set(null);
    try {
      return await this.ecomFetch<T>(path, options);
    } catch (err: unknown) {
      error?.set(err instanceof Error ? err.message : 'Request failed');
      throw err;
    } finally {
      loading?.set(false);
    }
  }
}
