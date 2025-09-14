import { mutate } from 'swr';
import { create } from 'zustand';
import type { PersistOptions } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
enableMapSet();

export type StateCreator<T> = Parameters<typeof immer<T>>[0];

export const createStore = <T>(storeCreator: StateCreator<T>) => create(immer<T>(storeCreator));

export const createStorageStore = <T, U>(
  options: PersistOptions<T, U>,
  storeCreator: StateCreator<T>,
) =>
  typeof window === 'undefined' // SSR
    ? createStore<T>(storeCreator)
    : create(persist(immer<T>(storeCreator), options));

export const invalidate = (key: string) => mutate(key, undefined, true);
