import { metaType } from '@treenity/core';
import { Params, TreenityService } from '@treenity/feathers-service';
import { PaypalConfigEntity } from '@/mods/paypal/entity/paypal.config.entity';
import { PaypalCreateDataEntity } from '@/mods/paypal/entity/paypal.create-data.entity';

export * from './consts';
export * from './entity';

export type InvoiceStatus = 'PAID' | 'CANCELLED';

export type PaypalService = Pick<TreenityService<any>, 'create'> & {
  config: PaypalConfigEntity;
  sendInvoice(data: PaypalCreateDataEntity, params: Params): Promise<{ href: string }>;
  createOrder(data: PaypalCreateDataEntity, params: Params): Promise<any>;
  authorizeOrder(id: string): Promise<string>;
  captureOrderWithAuthorization(authorizationId: string, amount: string): Promise<string>;
  captureOrder(orderId: string): Promise<string>;
  refundOrder(captureId: string, amount: number): Promise<number>;
  voidOrder(authorizationId: string): Promise<number>;
};

export const PaypalServiceType = metaType<PaypalService>('sys.paypal');
