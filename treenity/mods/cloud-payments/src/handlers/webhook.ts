import { Params } from '@treenity/feathers-service';
import {
  CheckNotification,
  ConfirmNotification,
  FailNotification,
  NotificationHandlers,
  PayNotification,
  ReceiptNotification,
  RecurrentNotification,
  RefundNotification,
} from 'cloudpayments';
import { CloudPaymentWebhookProxyEntity } from '../entities';
import { WebhookType } from './types';

interface WebhookHandlers {
  [key: string]: (data: any, params: Params) => Promise<any>;
}

export class CloudPaymentsWebhookHandler {
  private notificationHandler: NotificationHandlers;
  private proxyConfig: CloudPaymentWebhookProxyEntity;

  constructor(
    notificationHandler: NotificationHandlers,
    proxyConfig: CloudPaymentWebhookProxyEntity,
  ) {
    this.notificationHandler = notificationHandler;
    this.proxyConfig = proxyConfig;
  }

  private handlers: Record<WebhookType, any> = {
    check: this.check.bind(this),
    pay: this.pay.bind(this),
    fail: this.fail.bind(this),
    confirm: this.confirm.bind(this),
    refund: this.refund.bind(this),
    receipt: this.receipt.bind(this),
    recurrent: this.recurrent.bind(this),
    cancel: this.cancel.bind(this),
  };

  async proxyRequest(values: object) {
    let url = this.proxyConfig.url;
    if (!url) {
      throw new Error('Missing proxy url');
    }

    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }

    let requestOptions: RequestInit = {
      method: this.proxyConfig.method,
      headers: {
        ...this.proxyConfig.headers,
        ...(this.proxyConfig.method !== 'GET' && {
          'Content-Type': 'application/json',
        }),
      },
    };

    if (this.proxyConfig.method === 'GET') {
      const searchParams = new URLSearchParams();

      // Object.entries(values).forEach(([key, value]) => {
      //   addParam(key, value);
      // });

      const separator = url.includes('?') ? '&' : '?';
      const params = searchParams.toString();
      if (params) {
        url = `${url}${separator}${params}`;
      }
    } else {
      requestOptions.body = JSON.stringify({ ...values, paymentSystem: 'cloudPayments' });
    }

    const res = await fetch(url, requestOptions);
    const responseData = await res.json().catch(() => null);
    if (!res.ok) {
      const data = await res.json();
      throw new Error((data as any).message);
    }

    return responseData;
  }

  async check(data: CheckNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleCheckRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async pay(data: PayNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handlePayRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async fail(data: FailNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleFailRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async confirm(data: ConfirmNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleConfirmRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async refund(data: RefundNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleRefundRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async receipt(data: ReceiptNotification<any>, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleReceiptRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async recurrent(data: RecurrentNotification, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    await this.notificationHandler.handleRecurrentRequest(values);
    return await this.proxyRequest({ type, ...data });
  }

  async cancel(data: any, params: Params) {
    const { type } = params.query!;
    // @ts-ignore
    const values = { payload: params.rawBody!, headers: params.headers };
    return await this.proxyRequest({ type, ...data });
  }

  async webhook(data: any, params: Params) {
    const { type } = params.query!;

    const handler = this.handlers[type as WebhookType];
    if (!handler) {
      throw new Error(`Unknown webhook type: ${type}`);
    }

    return handler(data, params);
  }
}
