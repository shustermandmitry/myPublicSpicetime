import { createStore } from './create-store';

export interface LoadersStore {
  loading: Record<string, boolean>;

  set(key: string, value: boolean): () => void;
  get(key: string): boolean;

  subscribe(key: string, listener: (value: { isLoading: boolean }) => void): boolean;
}

export const useLoading = createStore<LoadersStore>((set, get, store) => ({
  loading: {},

  set(key: string, value: boolean): () => void {
    set(state => {
      state.loading[key] = value;
    });
    return () => {
      set(state => {
        state.loading[key] = false;
      });
    };
  },

  get(key: string): boolean {
    return !!get().loading[key];
  },

  subscribe(key: string, listener: (value: { isLoading: boolean }) => void): boolean {
    store.subscribe(state => {
      listener({ isLoading: state.loading[key] });
    });
    return get().loading[key];
  },
}));
