import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type StateUpdater<T> = Dispatch<SetStateAction<T>>;

export function useInputState<T>(initial: T): [T, StateUpdater<T>] {
  const [value, setValue] = useState<T>(initial);
  const setInputValue = useCallback<StateUpdater<T>>(
    (e: any) => {
      const value =
        e && 'target' in e ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
      setValue(value);
    },
    [setValue],
  );
  return [value, setInputValue];
}
