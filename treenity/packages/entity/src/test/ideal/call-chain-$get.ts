import { CallChain, CallChainMixins } from '@treenity/call-chain';
import '@treenity/call-chain/mixins';
import { MetaName, MetaPath } from '@treenity/core';

declare module '@treenity/call-chain' {
  export interface CallChainMixins<T> {
    $get<E>(type: MetaName<E>, path?: MetaPath): CallChain<E>;
  }
}
Object.assign(CallChainMixins, {
  _$get_<E>(this: any, ...args: any[]) {
    return this.get(...args);
  },
});
