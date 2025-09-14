import {
  Application,
  awaitService,
  feathersContext,
  Params,
  ServiceConstructorParams,
  TreenityService,
} from '@treenity/feathers-service';
import { PaypalApiClient } from '@/mods/paypal/handlers/client';
import { PaypalInvoiceHandler } from '@/mods/paypal/handlers/invoice';
import { PaypalWebhookHandler } from '@/mods/paypal/handlers/webhook';
import { PaypalOrderHandler } from '@/mods/paypal/handlers/order';
import { PayPalOrderResponse } from '@/mods/paypal/handlers/order.type';
import { PaypalCreateDataEntity } from '@/mods/paypal/entity/paypal.create-data.entity';
import { PaypalConfigEntity } from '@/mods/paypal/entity/paypal.config.entity';
import { PaypalServiceMetaEntity } from '@/mods/paypal/entity/paypal.entity';

interface PaypalHandler {
  invoice: PaypalInvoiceHandler;
  webhook: PaypalWebhookHandler;
  order: PaypalOrderHandler;
}

class PaypalService extends TreenityService<any> {
  storageService: any = null!;
  storagePath: string = null!;
  accessTokenStorageKey: string = null!;
  domainName: string = null!;
  config: PaypalConfigEntity = null!;
  handlers: PaypalHandler = {} as PaypalHandler;
  apiClient!: PaypalApiClient;

  constructor({ meta }: ServiceConstructorParams<PaypalServiceMetaEntity>) {
    super();
    this.storagePath = meta.storagePath!;
    this.config = meta.config ?? this.config;
    this.domainName = meta.domainName ?? this.domainName;
    this.accessTokenStorageKey = meta.accessTokenStorageKey ?? this.accessTokenStorageKey;
  }

  async _setup(app: Application, path: string) {
    this.storageService = await awaitService(app, this.storagePath);
    await this.init();
  }

  async init() {
    const { clientId, clientToken, invoice, webhook, order, currencyCode } = this.config!;
    const apiClient = new PaypalApiClient(
      clientId!,
      clientToken!,
      this.accessTokenStorageKey,
      this.storageService,
    );
    this.apiClient = apiClient;

    this.handlers.invoice = new PaypalInvoiceHandler(apiClient, {
      ...invoice,
      currencyCode,
      domainName: this.domainName,
    });

    this.handlers.webhook = new PaypalWebhookHandler(apiClient, this.storageService, webhook);
    this.handlers.order = new PaypalOrderHandler(apiClient, { ...order, currencyCode });

    await this.handlers.webhook.createWebhook().catch(e => {
      console.warn('Create webhook failed', JSON.stringify(e));
    });
  }

  async sendInvoice(data: PaypalCreateDataEntity): Promise<{ id: string; paymentLink: string }> {
    const result = await this.handlers.invoice.sendInvoice(data);
    return result;
  }

  async createOrder(data: PaypalCreateDataEntity): Promise<PayPalOrderResponse> {
    const result = await this.handlers.order.create(data);
    return result;
  }

  async authorizeOrder(id: string): Promise<string> {
    const result = await this.handlers.order.authorize(id);
    return result;
  }

  async captureOrderWithAuthorization(authorizationId: string, amount: string): Promise<string> {
    const result = await this.handlers.order.captureWithAuthorization(authorizationId, amount);
    return result;
  }

  async captureOrder(orderId: string): Promise<string> {
    const result = await this.handlers.order.capture(orderId);
    return result;
  }

  async refundOrder(captureId: string, amount: number) {
    const result = await this.handlers.order.refund(captureId, amount);
    return result;
  }

  async voidOrder(authorizationId: string) {
    const result = await this.handlers.order.void(authorizationId);
    return result;
  }

  /**
   * Handles the creation of a new resource based on a webhook event.
   * @param data - The data received from the webhook event.
   * @param params - The parameters passed to the function.
   * @returns An object with the created data, or a boolean indicating success.
   * @throws {Conflict} If the event type is not supported.
   * @throws {Conflict} If the additional data cannot be parsed.
   */
  //TODO: fix any type
  async create(data: any, params: Params) {
    return this.handlers.webhook.webhook(data, params);
  }
}

// types.meta.add('', 'paypal.service.meta', paypalServiceSchema);
feathersContext.add('paypal.service', PaypalService);

export default PaypalService;
