import {
  BaseResponse,
  ClientResponse,
  ConfirmPaymentRequest,
  CryptogramPayoutRequest,
  RefundPaymentRequest,
  SubscriptionCreateRequest,
  SubscriptionResponse,
  VoidPaymentRequest,
  PayoutResponse,
  TokenPayoutRequest,
  SubscriptionUpdateRequest,
} from 'cloudpayments';

export interface ICloudPaymentService {
  refundPayment(data: RefundPaymentRequest): Promise<ClientResponse<BaseResponse>>;
  createSubscription(
    data: SubscriptionCreateRequest,
  ): Promise<ClientResponse<SubscriptionResponse>>;
  updateSubscription(
    data: SubscriptionUpdateRequest,
  ): Promise<ClientResponse<SubscriptionResponse>>;
  cancelSubscription(data: SubscriptionUpdateRequest): Promise<BaseResponse>;

  voidPayment(data: VoidPaymentRequest): Promise<ClientResponse<BaseResponse>>;
  confirmPayment(data: ConfirmPaymentRequest): Promise<ClientResponse<BaseResponse>>;
  chargeCryptogramPayout(data: CryptogramPayoutRequest): Promise<PayoutResponse>;
  chargeTokenPayout(data: TokenPayoutRequest): Promise<PayoutResponse>;
  getSubscription(data: { Id: string }): Promise<SubscriptionResponse>;
}
