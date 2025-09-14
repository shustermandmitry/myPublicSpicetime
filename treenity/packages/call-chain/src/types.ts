import { CallChainMixins } from './mixins';

/**
 * Chain path section could be next field - string, or function call with arguments in the array.
 * function should be returned as the result of the previous field call
 */
export type PathSection = string | any[];
/**
 * Chain path is an array of path sections
 */
export type ChainPath = PathSection[];
/**
 * Primitive types
 */
export type Primitive = undefined | null | boolean | string | number | symbol | bigint;
/**
 * Represents a value that can be either a Promise or direct value, with added call-chain capabilities
 */
export type ValuePromise<T> = T extends Primitive
  ? Promise<T>
  : T extends Promise<any>
    ? T & CallChain<Awaited<T>>
    : CallChain<T>;
/**
 * Adds Promise-like behavior to all properties and methods of an object type
 */
export type PromiseAdder<T> = T extends Primitive
  ? T
  : {
      [K in keyof T]: T[K] extends (...args: infer A) => infer U
        ? ((...args: A) => ValuePromise<NonNullable<U>>) &
            // T[K] &
            CallChainMixins<Awaited<NonNullable<U>>>
        : ValuePromise<NonNullable<T[K]>>;
    };
/**
 * Main call chain type that combines Promise, PromiseAdder and Mixins
 */
export type CallChain<T> =
  T extends Promise<T> ? never : Promise<T> & PromiseAdder<T> & CallChainMixins<T>;

export interface ChainState {
  key: string;
  parent: ChainState;
  proxy: any;
  target: any;
  opts: any;
  path: ChainPath;
  cache: Map<string, any>;
}
