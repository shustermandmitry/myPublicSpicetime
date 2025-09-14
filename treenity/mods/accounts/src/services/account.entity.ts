import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const AccountType = metaType<any>('sys.accounts.account');

@entity(AccountType)
export class AccountEntity {
  id!: string;
  slug!: string;
  token!: string;
  precision!: number;
  displayPrecision!: number;
  negative: boolean = false;
  symbol?: string;
  symbolPosition!: string;
}
