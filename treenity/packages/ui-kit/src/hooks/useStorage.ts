import { useCallback, useState } from 'react';

function useStorage<T>(key: string): [T | undefined, (v: T | undefined) => void];
function useStorage<T>(key: string, defaultValue: T): [T, (v: T | undefined) => void];

function useStorage<T>(key: string, defaultValue?: T): [T | undefined, (v: T | undefined) => void] {
  if (typeof window === 'undefined') {
    return [defaultValue, () => {}];
  }

  const [value, setValue] = useState<T | undefined>(() => {
    const storageValue = localStorage.getItem(key);
    try {
      return storageValue ? (JSON.parse(storageValue) as T) : defaultValue;
    } catch (err) {
      console.warn('localstorage', key, 'parse error', err);
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });
  const setFn = useCallback((v: T | undefined) => {
    if (v === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(v));
    }
    setValue(v);
  }, []);

  return [value, setFn];
}

export default useStorage;
