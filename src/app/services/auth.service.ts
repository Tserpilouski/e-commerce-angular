import { computed, effect, inject, Injectable, Injector, signal } from '@angular/core';
import { AuthTokenResponse } from '@models/auth/auth.model';
import { Customer } from '@shared/models/customer.model';
import { CustomerSignInResult } from '@shared/models/customer-sign-in-result.model';
import { ApiClientService } from './api-client.service';

const CURRENT_USER_STORAGE_KEY = 'currentUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly injector = inject(Injector);
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  readonly currentUser = signal<Customer | null>(this.readStoredUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        sessionStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    });
  }

  private readStoredUser(): Customer | null {
    const raw = sessionStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as Customer;
    } catch {
      sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      return null;
    }
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = import.meta.env.NG_APP_CTP_CLIENT_ID;
    const clientSecret = import.meta.env.NG_APP_CTP_CLIENT_SECRET;
    const authUrl = import.meta.env.NG_APP_CTP_AUTH_URL;
    const scope = import.meta.env.NG_APP_CTP_SCOPES?.replace(/^"|"$/g, '');

    const apiClient = this.injector.get(ApiClientService);

    const data = await apiClient.httpFetch<AuthTokenResponse>(`${authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'client_credentials', scope }).toString(),
    });

    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return this.accessToken;
  }

  async login(email: string, password: string): Promise<CustomerSignInResult> {
    const apiClient = this.injector.get(ApiClientService);
    try {
      const result = await apiClient.ecomFetch<CustomerSignInResult>('login', {
        method: 'POST',
        body: { email, password },
      });
      this.currentUser.set(result.customer);
      return result;
    } catch (err) {
      if (err instanceof Error && (err.message.includes('400') || err.message.includes('401'))) {
        throw new Error('Invalid customer credentials. Please check your email and password.', { cause: err });
      }
      throw err;
    }
  }

  async register(customerData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<CustomerSignInResult> {
    const apiClient = this.injector.get(ApiClientService);
    try {
      const result = await apiClient.ecomFetch<{ customer: Customer }>('customers', {
        method: 'POST',
        body: customerData,
      });
      return {
        customer: result.customer,
      };
    } catch (err) {
      if (err instanceof Error && (err.message.includes('400') || err.message.includes('401'))) {
        throw new Error('Registration failed. The email address might already be in use.', { cause: err });
      }
      throw err;
    }
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
