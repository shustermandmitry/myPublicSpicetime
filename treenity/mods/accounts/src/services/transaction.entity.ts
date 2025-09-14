import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const TransactionType = metaType<any>('sys.accounts.transaction');

@entity(TransactionType)
export class TransactionEntity {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
  amount!: number;
  balance!: number;
  status!: number;
  description?: string;
  walletId!: string;
  fromId?: string;
  toId?: string;

  get isRefill() {
    return this.walletId === this.toId;
  }

  get isWithdrawal() {
    return this.walletId === this.fromId;
  }

  get isHold() {
    return this.status === 1;
  }
  get isSettled() {
    return this.status === 2;
  }
  get isRefund() {
    return this.status === 3;
  }
}
