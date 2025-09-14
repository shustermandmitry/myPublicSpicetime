import {
  abs,
  add,
  ceil,
  div,
  eq,
  exponentiation,
  floor,
  gt,
  gte,
  is_integer,
  is_negative,
  is_positive,
  is_zero,
  lt,
  lte,
  make,
  mul,
  neg,
  sqrt,
  string,
  sub,
} from 'bigfloat-esnext';
import type { IBigFloat, NumericValue } from 'bigfloat-esnext/lib/esm/types';

export class BigFloat<T extends BigFloat<any>> implements IBigFloat {
  public exponent: number;
  public coefficient: bigint;

  constructor(n?: NumericValue) {
    if (n === undefined) {
      this.exponent = 0;
      this.coefficient = 0n;
    } else {
      const { exponent, coefficient } = make(n);
      this.exponent = exponent;
      this.coefficient = coefficient;
    }
  }

  public decimalPlaces(): number {
    return this.dp();
  }
  public dp(): number {
    return -this.exponent;
  }
  public isInteger(): boolean {
    return this.isInt();
  }
  public isInt(): boolean {
    return is_integer(this);
  }
  public isNegative(): boolean {
    return this.isNeg();
  }
  public isNeg(): boolean {
    return is_negative(this);
  }
  public isPositive(): boolean {
    return this.isPos();
  }
  public isPos(): boolean {
    return is_positive(this);
  }
  public isZero(): boolean {
    return is_zero(this);
  }
  public toString(): string {
    return string(this) as string;
  }
  public cmp(y: NumericValue): number {
    return this.eq(y) ? 0 : this.lt(y) ? -1 : 1;
  }
  public equals(y: NumericValue): boolean {
    return this.eq(y);
  }
  public eq(y: NumericValue): boolean {
    return eq(this, make(y));
  }
  public greaterThan(y: NumericValue): boolean {
    return this.gt(y);
  }
  public gt(y: NumericValue): boolean {
    return gt(this, make(y));
  }
  public greaterThanOrEqualTo(y: NumericValue): boolean {
    return this.gte(y);
  }
  public gte(y: NumericValue): boolean {
    return gte(this, make(y));
  }
  public lessThan(y: NumericValue): boolean {
    return this.lt(y);
  }
  public lt(y: NumericValue): boolean {
    return lt(this, make(y));
  }
  public lessThanOrEqualTo(y: NumericValue): boolean {
    return this.lte(y);
  }
  public lte(y: NumericValue): boolean {
    return lte(this, make(y));
  }
  public absoluteValue(): T {
    return this.abs();
  }
  public abs(): T {
    // @ts-ignore
    return new this.constructor(abs(this));
  }
  public negated(): T {
    return this.neg();
  }
  public neg(): T {
    // @ts-ignore
    return new this.constructor(neg(this));
  }
  public squareRoot(): T {
    return this.sqrt();
  }
  public sqrt(): T {
    // @ts-ignore
    return new this.constructor(sqrt(this));
  }
  public dividedBy(y: NumericValue): T {
    return this.div(y);
  }
  public div(y: NumericValue): T {
    let madeY = make(y);
    if (is_zero(madeY)) {
      throw new Error(`Division by zero (dividend: ${this.toString()})`);
    }
    // @ts-ignore
    return new this.constructor(div(this, madeY));
  }
  public minus(y: NumericValue): T {
    return this.sub(y);
  }
  public sub(y: NumericValue): T {
    // @ts-ignore
    return new this.constructor(sub(this, make(y)));
  }
  public add(y: NumericValue): T {
    // @ts-ignore
    return new this.constructor(add(this, make(y)));
  }
  plus(y: NumericValue) {
    return this.add(y);
  }
  public times(y: NumericValue): T {
    return this.mul(y);
  }
  public mul(y: NumericValue): T {
    // @ts-ignore
    return new this.constructor(mul(this, make(y)));
  }
  public toPower(y: NumericValue): T {
    return this.pow(y);
  }
  public pow(y: NumericValue): T {
    // @ts-ignore
    return new this.constructor(exponentiation(this, make(y)));
  }
  public exp(n: number): T {
    // @ts-ignore
    const next = new this.constructor(this);
    next.exponent += n;
    return next;
  }
  public ceil(): T {
    // @ts-ignore
    return new this.constructor(ceil(this));
  }
  public floor(): T {
    // @ts-ignore
    return new this.constructor(floor(this));
  }
}
