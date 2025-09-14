import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const WalletType = metaType<WalletEntity>('sys.accounts.wallet');

@entity(WalletType)
export class WalletEntity {
  ID!: string;
  accountId!: string;
  token!: string;
  owner!: number;
  value!: number;
  income_holds!: number;
  outcome_holds!: number;
}
