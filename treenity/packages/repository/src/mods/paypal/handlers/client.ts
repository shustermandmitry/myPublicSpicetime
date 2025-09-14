import { PayPalUrls } from '@/mods/paypal/urls';

export class PaypalApiClient {
  private accessTokenStorageKey!: string;
  private clientId!: string;
  private clientToken!: string;
  storage!: any;

  constructor(clientId: string, clientToken: string, accessTokenStorageKey: string, storage: any) {
    this.clientToken = clientToken;
    this.clientId = clientId;
    this.accessTokenStorageKey = accessTokenStorageKey;
    this.storage = storage;
  }

  async getAccessToken() {
    const accessObject = await this.storage.get(this.accessTokenStorageKey);
    return accessObject?.data;
  }

  async requestAccessToken() {
    const accessToken = await this.getAccessToken();
    if (accessToken) {
      await this.storage.remove(this.accessTokenStorageKey);
    }

    const { url, method } = PayPalUrls.auth.createToken;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientToken}`).toString('base64')}`,
      isSkipNextRequest: 'true',
    };

    const body = {
      grant_type: 'client_credentials',
    };

    const { access_token, token_type, expires_in } = await this.request<{
      access_token: string;
      token_type: string;
      expires_in: number;
    }>(url as string, method, body, headers, false);

    await this.storage.create(
      {
        key: this.accessTokenStorageKey,
        data: {
          access_token,
          token_type,
        },
      },
      { query: { EX: expires_in } },
    );

    return { access_token, token_type, expires_in };
  }

  async request<T = any>(
    url: string,
    method: string,
    body: Record<string, any>,
    _headers?: Record<string, string>,
    isPaypalAuth = true,
  ): Promise<T> {
    let _body;

    const contentType = _headers?.['Content-Type'];
    const isUrlEncoded = contentType === 'application/x-www-form-urlencoded';

    if (isUrlEncoded) {
      _body = new URLSearchParams(body);
    } else {
      _body = JSON.stringify(body);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(_headers || {}),
    } as Record<string, string>;

    if (isPaypalAuth) {
      const accessObject = await this.getAccessToken();
      headers.Authorization = `${accessObject?.token_type} ${accessObject?.access_token}`;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: method === 'GET' ? undefined : _body,
    });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 401) {
        if (headers?.isSkipNextRequest) {
          throw new Error(
            (data as any)?.message || (data as any)?.error_description || 'Unauthorized',
          );
        }
        await this.requestAccessToken();
        return this.request(url, method, body, headers);
      }

      throw new Error((data as any).message);
    }

    const data = await res.json();
    return data as T;
  }
}
