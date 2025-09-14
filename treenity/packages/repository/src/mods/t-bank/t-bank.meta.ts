import { metaType } from '@treenity/core';
import { FromSchema, Params, TreenityService } from '@treenity/feathers-service';

export * from './entity';

export type PaymentStatus = 'CONFIRMED' | 'REJECTED';

export type TBankService = Pick<TreenityService<any>, 'create'> & {
  createOrder(data: any, params: Params): Promise<{ href: string; invoiceId: string }>;
  approveWithAuthorization(paymentId: string, amount: number): Promise<any>;
  refund(paymentId: string, amount: number): Promise<string>;
};

export const TBankServiceType = metaType<TBankService>('sys.t-bank');
