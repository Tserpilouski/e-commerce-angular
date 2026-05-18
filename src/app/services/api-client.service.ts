import { inject, Injectable, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
  private readonly authService = inject(AuthService);

  async ecomFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    const token = await this.authService.getAccessToken();
    const apiUrl = import.meta.env.NG_APP_CTP_API_URL;
    const projectKey = import.meta.env.NG_APP_CTP_PROJECT_KEY;

    return this.httpFetch<T>(`${apiUrl}/${projectKey}/${path}`, {
      ...options,
      headers: { ...options?.headers, Authorization: `Bearer ${token}` },
    });
  }

  httpFetch<T>(url: string, options?: FetchOptions): Promise<T> {
    const method = options?.method ?? 'GET';
    const headers = options?.headers;
    const params = options?.params;
    const body = options?.body;

    const request$ = this.http.request<T>(method, url, { headers, params, body }).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          const errorText = typeof err.error === 'object' ? JSON.stringify(err.error) : err.error || err.message;
          return throwError(() => new Error(`HTTP Error (${err.status}): ${errorText}`));
        }
        return throwError(() => err);
      }),
    );

    return lastValueFrom(request$);
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
      return await (options ? this.ecomFetch<T>(path, options) : this.ecomFetch<T>(path));
    } catch (err: unknown) {
      error?.set(err instanceof Error ? err.message : 'Request failed');
      throw err;
    } finally {
      loading?.set(false);
    }
  }
}
