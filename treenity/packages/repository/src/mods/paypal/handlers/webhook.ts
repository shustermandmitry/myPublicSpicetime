import { PayPalUrls } from '@/mods/paypal/urls';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';
import { get } from '@s-libs/micro-dash';
import { Conflict, Params } from '@treenity/feathers-service';
import {
  INVOICE_CANCELED,
  INVOICE_PAID,
  ORDER_COMPLETED,
  ORDER_APPROVED,
  PAYMENT_ORDER_CREATED,
  PAYMENT_ORDER_CANCELED,
  PAYMENT_CAPTURE_DENIED,
  PAYMENT_AUTHORIZATION_VOIDED,
} from '../consts';
import { PaypalConfigEntity } from '@/mods/paypal/entity/paypal.config.entity';

export type PaypalWebhookHandlerConfig = PaypalConfigEntity['webhook'];

export class PaypalWebhookHandler {
  private apiClient: PaypalApiClient;
  private storage!: any;
  private config!: PaypalWebhookHandlerConfig;

  constructor(client: PaypalApiClient, storage: any, config: PaypalWebhookHandlerConfig) {
    this.apiClient = client;
    this.storage = storage;
    this.config = config;
  }

  async getWebhookId(): Promise<string | undefined> {
    const webhookObject = await this.storage.get(this.config.storageKey);
    return webhookObject?.data?.webhook_id;
  }

  async get(webhookId: string) {
    const { url: _url, method } = PayPalUrls.webhook.create;
    const url = _url.replace(':webhook_id', webhookId);
    const response = await this.apiClient.request(url as string, method, {});
    return response;
  }

  async remove(webhookId: string) {
    const { url: _url, method } = PayPalUrls.webhook.remove;
    const url = _url.replace(':webhook_id', webhookId);
    const response = await this.apiClient.request(url as string, method, {});
    return response;
  }

  async create(eventTypes: { name: string }[]) {
    const { url, method } = PayPalUrls.webhook.create;
    const body = {
      url: this.config.url,
      event_types: eventTypes,
    };
    const response = await this.apiClient.request(url as string, method, body);
    return response;
  }

  async list() {
    const { url, method } = PayPalUrls.webhook.list;
    const { webhooks } = await this.apiClient.request(url as string, method, {});
    return webhooks;
  }

  async createWebhook() {
    const webhookId = await this.getWebhookId();

    if (webhookId) {
      const webhook = await this.get(webhookId).catch(() => undefined);
      if (webhookId === webhook?.id) return true;
    }

    //TODO: from meta
    const event_types = [
      {
        name: INVOICE_CANCELED,
      },
      {
        name: INVOICE_PAID,
      },
      {
        name: ORDER_COMPLETED,
      },
      {
        name: ORDER_APPROVED,
      },
      {
        name: PAYMENT_ORDER_CREATED,
      },
      {
        name: PAYMENT_ORDER_CANCELED,
      },
      {
        name: PAYMENT_CAPTURE_DENIED,
      },
      {
        name: PAYMENT_AUTHORIZATION_VOIDED,
      },
    ];

    const webhook = await this.create(event_types).catch(() => undefined);
    if (webhook) {
      await this.storage.remove(this.config.storageKey);
      await this.storage.create({ key: this.config.storageKey, data: { webhook_id: webhook.id } });
      return true;
    }

    const webhooks = await this.list();
    const currentWebhook = webhooks.find(
      (webhookItem: { id: string; url: string }) => webhookItem.url === this.config.url,
    );
    await this.storage.create({
      key: this.config.storageKey,
      data: { webhook_id: currentWebhook.id },
    });
    return true;
  }

  async verifyWebhook(data: any, params: Params) {
    const { url, method } = PayPalUrls.webhook.verify;

    const webhook_id = await this.getWebhookId();

    const _headers = params.headers;

    const auth_algo = get(_headers, 'paypal-auth-algo');
    const cert_url = get(_headers, 'paypal-cert-url');
    const transmission_id = get(_headers, 'paypal-transmission-id');
    const transmission_sig = get(_headers, 'paypal-transmission-sig');
    const transmission_time = get(_headers, 'paypal-transmission-time');

    const body = {
      auth_algo,
      cert_url,
      transmission_id,
      transmission_sig,
      transmission_time,
      webhook_id,
      webhook_event: data,
    };

    const response = await this.apiClient.request(url as string, method, body);

    const { verification_status } = response;

    if (verification_status !== 'SUCCESS') {
      throw new Conflict('Webhook verification failed');
    }
  }

  getAdditionalData(data: any) {
    //TODO : fix this function

    switch (data.event_type) {
      case INVOICE_CANCELED:
      case INVOICE_PAID: {
        const additionalDataStr = get(data, ['resource', 'invoice', 'detail', 'additional_data']);
        let additionalData;
        try {
          additionalData = JSON.parse(additionalDataStr);
        } catch (e) {
          throw new Conflict('Failed to parse additional data');
        }
        return additionalData;
      }
      case ORDER_COMPLETED:
      case ORDER_APPROVED:
      case PAYMENT_ORDER_CREATED:
      case PAYMENT_ORDER_CANCELED: {
        const additionalDataStr = get(data, ['resource', 'purchase_units', '0', 'custom_id']);
        let additionalData;
        try {
          additionalData = JSON.parse(additionalDataStr);
        } catch (e) {
          throw new Conflict('Failed to parse additional data');
        }
        return additionalData;
      }
    }
  }

  async webhook(data: any, params: Params) {
    await this.verifyWebhook(data, params);
    const headers = {
      'Content-Type': 'application/json',
    };

    const additionalData = this.getAdditionalData(data);
    if (this.config.proxyUrl) {
      await this.apiClient.request(
        this.config.proxyUrl,
        'POST',
        {
          ...data,
          additionalData,
        },
        headers,
        false,
      );
      return 'OK';
    }
    return 'OK';
  }
}
