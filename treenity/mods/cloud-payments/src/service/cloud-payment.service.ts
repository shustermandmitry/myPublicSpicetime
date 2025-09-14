import {
  Application,
  ApplicationHookOptions,
  feathersContext,
  ServiceConstructorParams,
  TreenityService,
} from '@treenity/feathers-service';
import {
  BaseRequest,
  BaseResponse,
  ClientApi,
  ClientResponse,
  ClientService,
  ConfirmPaymentRequest,
  CryptogramPayoutRequest,
  RefundPaymentRequest,
  SubscriptionCreateRequest,
  SubscriptionUpdateRequest,
  TaxationSystem,
  TokenPayoutRequest,
  VoidPaymentRequest,
} from 'cloudpayments';
import { Params } from '@treenity/feathers-service';
import { CloudPaymentsWebhookHandler } from '../handlers/webhook';
import { CloudPaymentServiceEntity, CloudPaymentWebhookProxyEntity } from '../entities';

class CloudPaymentService extends TreenityService<any> {
  private publicId!: string;
  private privateKey!: string;
  private inn!: number;
  private taxationSystem!: TaxationSystem;
  private endpoint?: string;
  private clientService!: ClientService;
  private webhookHandler!: CloudPaymentsWebhookHandler;
  private proxyConfig!: CloudPaymentWebhookProxyEntity;
  private clientApi!: ClientApi;

  constructor({ meta }: ServiceConstructorParams<CloudPaymentServiceEntity>) {
    super();
    this.publicId = meta.publicId ?? this.publicId;
    this.privateKey = meta.privateKey ?? this.privateKey;
    this.inn = meta.inn ?? this.inn;
    this.taxationSystem = meta.taxationSystem ?? this.taxationSystem;
    this.endpoint = meta.endpoint ?? this.endpoint;
    const proxyConfig = new CloudPaymentWebhookProxyEntity();
    Object.assign(proxyConfig, meta.proxy);
    this.proxyConfig = proxyConfig ?? this.proxyConfig;
  }

  async _setup(app: Application, path: string) {
    this.clientService = new ClientService({
      publicId: this.publicId,
      privateKey: this.privateKey,
      org: {
        inn: this.inn,
        taxationSystem: this.taxationSystem,
      },
    });

    const notificationHandler = this.clientService.getNotificationHandlers();
    this.webhookHandler = new CloudPaymentsWebhookHandler(notificationHandler, this.proxyConfig);
    this.clientApi = this.clientService.getClientApi();
  }

  async refundPayment(data: RefundPaymentRequest) {
    const res = await this.clientApi.refundPayment(data);
    return res.getResponse();
  }

  async createSubscription(data: SubscriptionCreateRequest) {
    const res = await this.clientApi.createSubscription(data);
    return res.getResponse();
  }

  async cancelSubscription(data: SubscriptionUpdateRequest) {
    const res = await this.clientApi.cancelSubscription(data);
    return res.getResponse();
  }

  async updateSubscription(data: SubscriptionUpdateRequest) {
    const res = await this.clientApi.updateSubscription(data);
    return res.getResponse();
  }

  async voidPayment(data: VoidPaymentRequest) {
    const res = await this.clientApi.voidPayment(data);
    return res.getResponse();
  }

  async confirmPayment(data: ConfirmPaymentRequest) {
    const res = await this.clientApi.confirmPayment(data);
    return res.getResponse();
  }

  async chargeCryptogramPayout(data: CryptogramPayoutRequest) {
    const res = await this.clientApi.chargeCryptogramPayout(data);
    return res.getResponse();
  }

  async getSubscription(data: { Id: string }) {
    const res = await this.clientApi.getSubscription(data);
    return res.getResponse();
  }

  async chargeTokenPayout(data: TokenPayoutRequest) {
    const res = await this.clientApi.chargeTokenPayout(data);
    return res.getResponse();
  }

  //Web hook
  async create(data: object, params: Params) {
    return this.webhookHandler.webhook(data, params);
  }
}

feathersContext.add('cloud-payment.service', CloudPaymentService);

export default CloudPaymentService;
