/*
 * Copyright (c) 2024. Treenity Inc.
 */

import useSWR, { SWRResponse, mutate } from 'swr';
import { CallChain, CallChainMixins, ChainState } from './call-chain';
import { SWRConfiguration } from 'swr/_internal';

Object.assign(CallChainMixins, {
  use(this: ChainState, config?: SWRConfiguration): SWRResponse<any> {
    const then = CallChainMixins.then.bind(this);
    const data = useSWR(this.key, () => ({ then }), config);

    if (!config?.suspense && data.error) console.error(data.error);
    data.mutate = () => {
      // reset call cache before swr rerun
      this.cache.delete(this.key + ':then-mixin');
      return mutate(this.key);
    };

    return data;
  },

  _map_<R>(this: any, transform: (value: any) => R, options?: MapOptions): R {
    return transform(this);
  },

  _key_<R>(this: R, key: string): R {
    return this;
  },

  $reset(this: ChainState) {
    this.cache.delete(this.key + ':then-mixin');
  },
});

interface MapOptions {
  key: string; // cache key, if you are not sure that the path will differ for other map
}

declare module './call-chain' {
  export interface CallChainMixins<T> {
    use(config?: SWRConfiguration): SWRResponse<T>;
    map<R>(transform: (value: T) => R, options?: MapOptions): CallChain<Awaited<R>>;
    key<R>(this: R, key: string): R;
    $reset(): void;
    // subscribe(callback: (value: T) => void): Subscription;
    // debounce(ms: number): CallChain<T>;
  }
}
