import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { PaypalConfigEntity } from './paypal.config.entity';

export const PaypalServiceMetaType = metaType<PaypalServiceMetaEntity>('paypal.service.meta');

@entity(PaypalServiceMetaType)
export class PaypalServiceMetaEntity {
  storagePath!: string;
  accessTokenStorageKey!: string;
  webhookUrl!: string;
  domainName!: string;
  webhookProxyUrl!: string;
  config!: PaypalConfigEntity;
}
