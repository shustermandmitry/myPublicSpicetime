import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { createToken, DecimalBN, SymbolPosition } from '@treenity/js-shared/utils';
import { AccountEntity } from './account.entity';

export const ExchangerType = metaType<ExchangerEntity>('sys.accounts.exchanger');

@entity(ExchangerType)
export class ExchangerEntity {
  id?: number;
  slug!: string;
  rate!: number;
  fromId?: string;
  toId?: string;
  from?: AccountEntity;
  to?: AccountEntity;
 
  convert(amount: number): DecimalBN {
    if (!this.to) {
      throw new Error('Convert with to account failed');
    }
    const token = createToken(this.to.token, this.to.precision, this.to.precision, {
      icon: this.to.symbol ?? '',
      position: this.to.symbolPosition as SymbolPosition,
    });
    const convertedAmount = amount * this.rate;
    return token.parse(convertedAmount)!;
  }
}
