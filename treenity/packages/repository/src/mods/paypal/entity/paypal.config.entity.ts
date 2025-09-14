import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const PaypalConfigType = metaType<PaypalConfigEntity>('paypal.config');

@entity(PaypalConfigType)
export class PaypalConfigEntity {
  clientId!: string;
  clientToken!: string;
  currencyCode!: string;
  invoice?: {
    mailSubject?: string;
    mailNote?: string;
    sendToRecipient?: boolean;
    sendToInvoicer?: boolean;
  };
  webhook!: {
    url: string;
    proxyUrl?: string;
    storageKey: string;
  };
  order!: {
    autoAuthorize?: boolean;
    successUrl?: string;
    cancelUrl?: string;
  };
}
