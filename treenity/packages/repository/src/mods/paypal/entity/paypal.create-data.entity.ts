import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { PaypalConfigEntity } from './paypal.config.entity';

export const PaypalCreateDataType = metaType<PaypalCreateDataEntity>('paypal.create-data');

@entity(PaypalCreateDataType)
export class PaypalCreateDataEntity {
  website?: string;
  quantity!: number;
  createDate!: string;
  dueDate!: string;
  lang!: string;
  amount!: number;
  buyerId!: number;
  userName!: string;
  email!: string;
  linkParams?: {
    ownerId: number | string;
    eventId: number | string;
  };
  additional!: {
    paymentMethod: string;
    customId: string;
  };
  item!: {
    title: string;
    description: string;
  };
}
