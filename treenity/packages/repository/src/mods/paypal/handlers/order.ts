import { PayPalUrls } from '@/mods/paypal/urls';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';
import { get, set } from '@s-libs/micro-dash';
import { Params } from '@treenity/feathers-service';
import { PayPalOrderResponse } from '@/mods/paypal/handlers/order.type';
import { ORDER_INTENT_AUTHORIZE, ORDER_INTENT_CAPTURE } from '@/mods/paypal/consts';
import { PaypalCreateDataEntity } from '@/mods/paypal/entity/paypal.create-data.entity';
import { PaypalConfigEntity } from '@/mods/paypal/entity/paypal.config.entity';

export type PaypalOrderHandlerConfig = PaypalConfigEntity['order'] &
  Pick<PaypalConfigEntity, 'currencyCode'>;

export class PaypalOrderHandler {
  private apiClient: PaypalApiClient;
  private config!: PaypalOrderHandlerConfig;

  constructor(client: PaypalApiClient, config: PaypalOrderHandlerConfig) {
    this.apiClient = client;
    this.config = config;
  }

  convertUrl(url?: string, data?: object) {
    if (!url || !data) {
      return url;
    }

    Object.entries(data).forEach(([key, value]) => {
      url = url!.replace(`:${key}`, value);
    });
    return url;
  }

  getLink(order: PayPalOrderResponse, key: string): string | undefined {
    return order.links.find(link => link.rel === key)?.href;
  }

  async create(data: PaypalCreateDataEntity) {
    const { amount, item, additional, linkParams } = data;
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const intent = this.config.autoAuthorize ? ORDER_INTENT_CAPTURE : ORDER_INTENT_AUTHORIZE;
    const requestData = {
      intent,
      purchase_units: [
        {
          custom_id: JSON.stringify(additional),
          description: item.description,
          amount: {
            currency_code: this.config.currencyCode,
            value: amount.toString(),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: this.convertUrl(this.config.successUrl, linkParams),
            cancel_url: this.convertUrl(this.config.cancelUrl, linkParams),
          },
        },
      },
    };
    const { url, method } = PayPalUrls.order.create;
    const resultRequest = await this.apiClient.request<PayPalOrderResponse>(
      url,
      method,
      requestData,
      headers,
    );
    const paymentLink = this.getLink(resultRequest, 'payer-action');
    console.log('paypal order config', this.config);
    return {
      ...resultRequest,
      paymentLink,
      twoStagePayment: !this.config.autoAuthorize,
    };
  }

  async authorize(orderId: string) {
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const { url: _url, method } = PayPalUrls.order.authorize;
    const url = _url.replace(':order_id', orderId);
    const result = await this.apiClient.request<any>(url, method, { orderId }, headers);
    const authorizationId = get(result, [
      'purchase_units',
      '0',
      'payments',
      'authorizations',
      '0',
      'id',
    ]);
    return authorizationId;
  }

  async captureWithAuthorization(authorizationId: string, amount: string) {
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const { url: _url, method } = PayPalUrls.payment.capture;
    const url = _url.replace(':authorization_id', authorizationId);
    const result = await this.apiClient.request<any>(
      url,
      method,
      {
        amount: {
          currency_code: this.config.currencyCode,
          value: amount,
        },
      },
      headers,
    );

    return result.id;
  }

  async capture(orderId: string) {
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const { url: _url, method } = PayPalUrls.order.capture;
    const url = _url.replace(':order_id', orderId);
    const result = await this.apiClient.request<any>(url, method, {}, headers);
    const captureId = get(result, ['purchase_units', 0, 'payments', 'captures', 0, 'id']);
    return captureId;
  }

  async refund(captureId: string, amount: number) {
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const { url: _url, method } = PayPalUrls.payment.refund;
    const url = _url.replace(':capture_id', captureId);
    const result = await this.apiClient.request<any>(
      url,
      method,
      {
        amount: {
          currency_code: 'USD', //TODO: from metas
          value: amount,
        },
      },
      headers,
    );

    return result.id;
  }

  async void(authorizationId: string) {
    const headers = {};
    set(headers, ['Prefer'], 'return=representation');
    const { url: _url, method } = PayPalUrls.payment.void;
    const url = _url.replace(':authorization_id', authorizationId);
    const result = await this.apiClient.request<any>(url, method, {}, headers);

    return result.id;
  }
}
