import { useCallback, useState } from 'react';
import { produce } from 'immer';

type ImmerCallback<T> = (val: T) => T | void;

export function useImmer<T>(initial: T | (() => T)): [T, (cb: ImmerCallback<T> | T) => void] {
  const [data, setData] = useState(initial);
  const setImmer = useCallback(
    (cb: ImmerCallback<T> | T) =>
      // @ts-ignore in `produce(data, cb)` cb is not assignable, but we know, it is function
      typeof cb === 'function' ? setData(data => produce(data, cb)) : setData(cb),
    [setData],
  );
  return [data, setImmer];
}
