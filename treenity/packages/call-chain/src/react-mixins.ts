import useSWR, { SWRResponse } from 'swr';

import { callChainMixins } from './mixins';
import { ChainState } from './types';

Object.assign(callChainMixins, {
  $use(this: ChainState): SWRResponse<any> {
    const then = callChainMixins.then.bind(this);
    return useSWR(this.key, () => ({ then }));
  },
});

declare module './mixins' {
  export interface CallChainMixins<T> {
    $use(): SWRResponse<T>;
  }
}
