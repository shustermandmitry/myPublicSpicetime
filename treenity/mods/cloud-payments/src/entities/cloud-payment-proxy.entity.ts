import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { TaxationSystem } from 'cloudpayments';

export const CloudPaymentWebhookProxyMetaType = metaType<CloudPaymentWebhookProxyEntity>(
  'cloud-payment.webhook.proxy.meta',
);

@entity(CloudPaymentWebhookProxyMetaType)
export class CloudPaymentWebhookProxyEntity {
  url!: string;
  method!: string;
  headers?: Record<string, string>;
}
