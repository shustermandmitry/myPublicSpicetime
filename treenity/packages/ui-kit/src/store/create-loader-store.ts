import { useLoading } from '@/store/loading';
import { Draft } from 'immer';
import { useMemo } from 'react';
import useSwr, { SWRResponse } from 'swr';
import { createStore, StateCreator } from './create-store';

export interface LoadState<T> {
  useLoad(): void;
}

interface LoadStateLoader<T> extends LoadState<T> {
  useLoader<R>(
    key: string,
    fetcher: () => Promise<R>,
    callback: (store: Draft<T>, result: R) => void,
  ): SWRResponse<R>;
}

export type StateCreatorLoader<T> = (
  set: Parameters<StateCreator<T>>[0],
  get: Parameters<StateCreator<T & LoadStateLoader<T>>>[1], // get has some additional functions
  store: Parameters<StateCreator<T>>[2],
) => T & LoadState<T>;
type LoaderStore<T> = ReturnType<typeof createStore<T & LoadStateLoader<T>>>;
export const createLoaderStore = <T>(stateCreator: StateCreatorLoader<T>): LoaderStore<T> => {
  type TL = T & LoadStateLoader<T>;

  const stateWithLoader: StateCreatorLoader<T> = (set, get, store) => {
    const state = stateCreator(set, get, store) as TL;
    let first = true;
    state.useLoader = (key, fetcher, callback) => {
      return useSwr(
        key,
        () => {
          const loadingOff = useLoading.getState().set(key, first);
          return fetcher()
            .then(result => {
              set(state => {
                callback(state, result);
              });
              return result;
            })
            .finally(() => {
              loadingOff();
              first = false;
            });
        },
        typeof window !== 'undefined' &&
          // @ts-ignore
          window.ENV?.NODE_ENV === 'development' &&
          // @ts-ignore
          window.ENV?.ENABLE_SWR_UPDATE_IN_DEV !== 'true'
          ? {
              revalidateIfStale: false,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
            }
          : undefined,
      );
    };

    return state;
  };

  // @ts-ignore
  const useStore = createStore<TL>(stateWithLoader);

  type Store = typeof useStore;

  const store = () => {
    const store = useStore();
    store.useLoad();
    return store;
  };
  (store as Store).getState = useStore.getState;
  (store as Store).setState = useStore.setState;
  (store as Store).subscribe = useStore.subscribe;

  // @ts-ignore
  return store;
};

export const createComponentStore =
  <T, P extends any[]>(creatorCreator: (...args: P) => StateCreatorLoader<T>) =>
  (...args: P) => {
    const useStore = useMemo(() => createLoaderStore<T>(creatorCreator(...args)), args);
    const store = useStore();
    store.useLoad();
    return store;
  };
