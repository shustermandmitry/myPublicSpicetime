/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { callChainMixins, defineMixin } from './mixins';
import { CallChain } from './types';

interface MapOptions {
  key: string; // cache key, if you are not sure that the path will differ for other map
}

declare module './mixins' {
  export interface CallChainMixins<T> {
    $map<R>(transform: (value: T) => R, options?: MapOptions): CallChain<Awaited<R>>;
    $key<R>(this: R, key: string): R;
    // subscribe(callback: (value: T) => void): Subscription;
    // debounce(ms: number): CallChain<T>;
  }
}

defineMixin({
  $map<R>(this: any, transform: (value: any) => R, options?: MapOptions): R {
    return transform(this);
  },

  $key<R>(this: R, key: string): R {
    return this;
  },
});
