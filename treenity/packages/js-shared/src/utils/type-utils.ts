export interface Obj<T = any> {
  [name: string]: T;
}

/**
 * primitive types
 */
export type Primitive = undefined | null | boolean | string | number | symbol | bigint;

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type IfReadonly<T, P extends keyof T, A, B> = IfEquals<
  { [Q in P]: T[P] },
  { -readonly [Q in P]: T[P] },
  B,
  A
>;

type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfReadonly<T, P, never, P>;
};

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>;
};

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionReadonlyPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K] extends new (...args: any[]) => any
      ? K
      : never
    : IfReadonly<T, K, never, K>;
}[keyof T];

export type Raw<T> = Pick<T, NonFunctionReadonlyPropertyNames<T>>;

/**
 * recursive readonly
 */
export type RReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Primitive ? T[K] : RReadonly<T[K]>;
};

/**
 * recursive partial
 */
export type RPartial<T> = {
  [K in keyof T]?: T[K] extends {} ? RPartial<T[K]> : T[K];
};

/**
 * check if T is any
 */
type IsAny<T> = 0 extends 1 & T ? true : false;
