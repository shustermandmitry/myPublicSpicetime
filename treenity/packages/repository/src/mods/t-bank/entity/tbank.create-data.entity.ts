import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const TBankCreateDataType = metaType<TBankCreateDataEntity>('tbank.create-data');

@entity(TBankCreateDataType)
export class TBankCreateDataEntity {
  website?: string;
  quantity!: number;
  createDate!: string;
  dueDate!: string;
  amount!: number;
  lang!: string;
  buyerId!: number;
  userName!: string;
  email!: string;
  linkParams?: {
    ownerId: string | number;
    eventId: string | number;
  };
  additional!: {
    paymentMethod: string;
    customId?: string;
  };
  item!: {
    title: string;
    description: string;
  };
}
