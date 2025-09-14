// import BN = require('bn.js');
import { div, exponentiation, floor, make, mul, number } from 'bigfloat-esnext';
// import Decimal from 'decimal.js';
import { NumericValue } from 'bigfloat-esnext/lib/esm/types';
import { BigFloat } from './bigfloat-t';

export const D_10 = new BigFloat(10);

export type SymbolPosition = 'before' | 'after';

export type SymbolParams = {
  icon: string;
  position: SymbolPosition;
};

/**
 * Class, that can be created with `new` with predefined symbol,
 * decimals and print precision.
 */
export type Token = typeof DecimalBN;

export class DecimalBN extends BigFloat<DecimalBN> {
  static symbol: string = '';
  static decimals: number = 8;
  static print: number = 2;
  static symbolParams?: SymbolParams;
  bi?: bigint;

  constructor(n: NumericValue) {
    super();

    let self = make(n);
    if (self.exponent < -this.clas.decimals) {
      const dec = exponentiation(D_10, make(this.clas.decimals));

      self = div(floor(mul(self, dec)), dec, -this.clas.decimals);
    }
    this.exponent = self.exponent;
    this.coefficient = self.coefficient;
  }

  private wrapInSymbol(val: DecimalBN | string): string {
    const { symbolParams, symbol } = this.clas;

    if (!symbolParams?.icon || !symbolParams?.position) {
      return `${val} ${symbol}`;
    }

    return symbolParams.position === 'before'
      ? `${symbolParams.icon} ${val}`
      : `${val} ${symbolParams.icon}`;
  }

  // static fromBN(bn: BN | u64): DecimalBN {
  //     return new this(bn.toString()).exp(-this.decimals);
  // }
  static from(n: NumericValue) {
    return new this(n);
  }

  static fromBNString(bnString: string): DecimalBN {
    return this.parse(bnString);
  }

  static parse(n: string | bigint | number): DecimalBN {
    return new this(n).exp(-this.decimals);
  }

  // static fromDecimal(decimal: Decimal): DecimalBN {
  //     return new this(decimal.toString());
  // }

  get clas(): Token {
    return this.constructor as Token;
  }

  // toBN(): u64 {
  //     if (!this.bn) this.bn = new u64(this.exp(this.clas.decimals).floor().toString());
  //     return this.bn;
  // }

  toBigInt(): bigint {
    return (this.bi ??= BigInt(this.exp(this.clas.decimals).floor().toString()));
  }

  format(digits: number = this.clas.print): string {
    if (this.isInteger()) return this.wrapInSymbol(this);
    return this.wrapInSymbol(this.toFixed(digits));
  }

  toFixed(decimals: number = this.clas.print) {
    const [a, b] = super.toString().split('.').concat('');
    if (decimals === 0) return a;
    return a + '.' + b.slice(0, decimals).padEnd(decimals, '0');
  }

  toNumber(): number {
    return number(this);
  }

  static min(a: DecimalBN, b: DecimalBN): DecimalBN {
    return b.gt(a) ? a : b;
  }
}

const tokens: Record<string, Token> = {};

export function getToken(symbol: string): Token {
  const token = tokens[symbol];
  if (!token) throw new Error(`Token ${symbol} not found`);

  return token;
}

/**
 * Create token(named number format, like USD, RUB, ETH, etc.) with specific
 * precision and print precision. It's a class that extends DecimalBN.
 * In has BigFloat inside for always - precise arithmetic.
 * [GitHub](https://github.com/davidmartinez10/bigfloat-esnext)
 * bigfloat always
 * @param symbol - name of the token
 * @param decimals - number of zeros after the point, precision (6 = 0.123456)
 * @param print - print precision (2 = 0.12)
 * @param symbolParams = object with params for symbol ({icon: '$', position: 'before})
 */
export function createToken(
  symbol: string,
  decimals: number,
  print: number,
  symbolParams?: SymbolParams,
): Token {
  let token: Token = tokens[symbol];
  if (token) {
    if (token.decimals !== decimals || token.print !== print) {
      throw new Error(`Token ${symbol} already exists with different decimals or print`);
    }
    return token;
  }

  return (tokens[symbol] = class extends DecimalBN {
    static decimals: number = decimals;
    static print = print;
    static symbol = symbol;
    static symbolParams = symbolParams;
  });
}

export function parseToken(stringValue: string): DecimalBN {
  const [value, symbol] = stringValue.split(' ');
  return getToken(symbol).from(value);
}
