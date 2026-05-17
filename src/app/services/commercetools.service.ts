import { Injectable, signal } from '@angular/core';
import { ProductPagedQueryResponse } from '../models/products/product-paged-query-response.model';
import { Product } from '../models/products/product.model';
import { AuthTokenResponse } from '../models/auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class CommercetoolsService {
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = import.meta.env.NG_APP_CTP_CLIENT_ID;
    const clientSecret = import.meta.env.NG_APP_CTP_CLIENT_SECRET;
    const authUrl = import.meta.env.NG_APP_CTP_AUTH_URL;
    const scope = import.meta.env.NG_APP_CTP_SCOPES;

    const res = await fetch(`${authUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'client_credentials', scope }).toString(),
    });

    if (!res.ok) throw new Error(`Auth Error (${res.status}): ${await res.text()}`);

    const data: AuthTokenResponse = await res.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // 60s expiration buffer
    return this.accessToken;
  }

  async fetchProducts(limit = 20, offset = 0): Promise<Product[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const token = await this.getAccessToken();
      const apiUrl = import.meta.env.NG_APP_CTP_API_URL;
      const projectKey = import.meta.env.NG_APP_CTP_PROJECT_KEY;

      const res = await fetch(`${apiUrl}/${projectKey}/product-projections?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`API Error (${res.status}): ${await res.text()}`);

      const data: ProductPagedQueryResponse = await res.json();
      this.products.set(data.results);
      return data.results;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      this.error.set(errorMessage);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
