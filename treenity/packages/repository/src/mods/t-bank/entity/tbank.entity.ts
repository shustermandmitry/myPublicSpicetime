import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const TBankServiceMetaType = metaType<TBankServiceMetaEntity>('tbank.service.meta');

@entity(TBankServiceMetaType)
export class TBankServiceMetaEntity {
  terminalKey!: string;
  password!: string;
  publicKey!: string;
  webhookUrl!: string;
  webhookProxyUrl?: string;
  successUrl!: string;
  failUrl!: string;
  /** @description read in documentation https://www.tbank.ru/kassa/dev/payments/#tag/Standartnyj-platezh/operation/Init */
  taxation!: string;
  /** @description read in documentation https://www.tbank.ru/kassa/dev/payments/#tag/Standartnyj-platezh/operation/Init */
  tax!: string;
  /** @description read in documentation https://www.tbank.ru/kassa/dev/payments/#tag/Standartnyj-platezh/operation/Init */
  paymentMethod!: string;
  /** @description read in documentation https://www.tbank.ru/kassa/dev/payments/#tag/Standartnyj-platezh/operation/Init */
  paymentObject!: string;
  /** @description 'P' or 'O'
   Determines the type of payment - two-stage or one-stage payment. */
  payType: string = 'T';
}
