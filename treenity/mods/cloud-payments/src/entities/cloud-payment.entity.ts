import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { TaxationSystem } from 'cloudpayments';
import { CloudPaymentWebhookProxyEntity } from './index';

export const CloudPaymentServiceMetaType = metaType<CloudPaymentServiceEntity>(
  'cloud-payment.service.meta',
);

@entity(CloudPaymentServiceMetaType)
export class CloudPaymentServiceEntity {
  endpoint?: string;
  privateKey!: string;
  publicId!: string;
  taxationSystem!: TaxationSystem;
  inn!: number;
  proxy!: CloudPaymentWebhookProxyEntity;
}
