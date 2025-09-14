import type { PageEditor } from '@/store/editor';
import { createEditorStore } from '@/store/editor';

import type { Context, FC, PropsWithChildren } from 'react';
import { createContext, useContext, useRef } from 'react';

type UseEditorStore = ReturnType<typeof createEditorStore>;

export function useEditorStore<T = PageEditor>(selector?: (s: PageEditor) => T): T {
  const useStore = useContext(EditorContext);

  if (!useStore) throw new Error('have you added PageEditorContext?');

  if (!selector) {
    return useStore() as T;
  }

  return useStore(selector);
}

export const EditorContext: Context<UseEditorStore | undefined> = createContext<
  UseEditorStore | undefined
>(undefined);

export const PageEditorContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const prevProvider = useContext(EditorContext);
  if (prevProvider) {
    throw new Error('already have provider');
  }

  const storeRef = useRef<UseEditorStore>();

  if (!storeRef.current) {
    storeRef.current = createEditorStore();
  }

  return <EditorContext.Provider value={storeRef.current}>{children}</EditorContext.Provider>;
};

export const NodeEngineNamespaceContext = createContext<string>('main');
