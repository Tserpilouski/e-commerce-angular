import { inject, Injectable, Injector } from '@angular/core';
import { AuthTokenResponse } from '../models/auth/auth.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly injector = inject(Injector);
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = import.meta.env.NG_APP_CTP_CLIENT_ID;
    const clientSecret = import.meta.env.NG_APP_CTP_CLIENT_SECRET;
    const authUrl = import.meta.env.NG_APP_CTP_AUTH_URL;
    const scope = import.meta.env.NG_APP_CTP_SCOPES;

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
}
