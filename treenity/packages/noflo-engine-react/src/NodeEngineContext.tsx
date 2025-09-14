import { Context, createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { createEngineStore, NodeEngineStore } from './node-engine-store';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

type UseEngineStore = ReturnType<typeof createEngineStore>;

export function useEngineStore<T = NodeEngineStore>(selector?: (s: NodeEngineStore) => T): T {
  const useStore = useContext(NodeEngineContext);

  if (!useStore) throw new Error('have you added NodeEngineContextProvider?');

  if (!selector) {
    return useStore() as T;
  }
  return useStore(selector);
}

export const NodeEngineContext: Context<UseEngineStore | undefined> = createContext<
  UseEngineStore | undefined
>(undefined);

export const NodeEngineContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const prevProvider = useContext(NodeEngineContext);
  if (prevProvider) {
    throw new Error('already have provider');
  }

  const store = useMemo(createEngineStore, []);

  return <NodeEngineContext.Provider value={store} children={children} />;
};

export const NodeEngineNamespaceContext = createContext<string>('main');
