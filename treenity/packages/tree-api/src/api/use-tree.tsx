import { Application } from '@feathersjs/feathers';
import { chainCall, CallChain, CallChainMixins } from '@treenity/call-chain';
import '@treenity/call-chain/mixins';
import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { TreeApi } from './tree-api';
import { MetaName, MetaPath } from '@treenity/core';


interface TreeApiContext {
  api: TreeApi;
  chain: CallChain<TreeApi>;
}

export const TreeApiContext: React.Context<TreeApiContext> = createContext<TreeApiContext>(null!);

export const TreeApiContextProvider: FC<PropsWithChildren<{ application: Application }>> = ({ children, application }) => {
  const value = useMemo(() => {
    const treeApi = new TreeApi(application);

    const treeChain = chainCall(treeApi);

    return { /*subClient, */ api: treeApi, chain: treeChain };
  }, [application]);


  return <TreeApiContext.Provider value={value} children={children} />
}

export function useTree(): TreeApi {
  return useContext(TreeApiContext).api;
}

// root which calls useTree inself
export const useRoot: CallChain<TreeApi> = new Proxy({}, {
  get(target, prop) {
    return (useContext(TreeApiContext).chain as any)[prop];
  }
}) as CallChain<TreeApi>;

declare module '@treenity/call-chain' {
  export interface CallChainMixins<T> {
    $get<E>(type: MetaName<E>, path?: MetaPath): CallChain<E>;
  }
}
Object.assign(CallChainMixins, {
  _$get_<E>(this: any, ...args: any[]) {
    return this.get(...args);
  }
});
