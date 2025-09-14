import { useRef } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

export type Configuration = SWRConfiguration & { revalidate?: boolean };

const SWR_DONT_REVALIDATE = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// TODO: write tests
/**
 * Sync version of useSWR, run its callback synchronously, and could resolve synchronous-promise,
 * it will reduce flicker if component could be loaded from cache
 * @param id
 * @param cb
 * @param config
 */
export function useSwrSync<T>(
  id: string,
  cb: () => Promise<T> | T,
  config: Configuration = {},
): SWRResponse<T> {
  const isFirst = useRef(true);
  if (config.revalidate === false) {
    config = Object.assign({}, SWR_DONT_REVALIDATE, config);
  }

  let prom: any;
  const result = useSWR(id, () => prom || cb(), config);
  // try resolve promise synchronously (yes, we using synchronous-promise package for this)
  if (isFirst.current) {
    isFirst.current = false;
    let error;
    try {
      prom = cb();
    } catch (err) {
      error = err;
    }
    if (prom) {
      if (typeof prom.then === 'function') {
        let value;
        prom.then(
          v => (value = v),
          err => (error = err),
        );
        if (value != undefined) return { ...result, data: value };
      } else {
        return { ...result, data: prom };
      }
    }
    if (error) {
      return { ...result, error };
    }
  }

  return result;
}

export function useSwrSync2<T>(
  id: string,
  cb: () => Promise<T> | T,
  config: Configuration = {},
): { data?: T; error?: Error } {
  const isFirst = useRef(true);

  const use = next => {
    return (key, fn, config) => {
      const result = next(key, fn, config);
      if (isFirst.current) {
        isFirst.current = false;
        let error;
        let value;
        try {
          value = fn();
        } catch (err) {
          error = err;
        }
        if (value != undefined) return { ...result, data: value };
        if (error) {
          return { ...result, error };
        }
      }
      return result;
    };
  };

  if (config.revalidate === false) {
    config = Object.assign({ use }, SWR_DONT_REVALIDATE, config);
  }

  let prom: any;
  const result = useSWR(id, () => prom || cb(), config);
  // try resolve promise synchronously (yes, we using synchronous-promise package for this)
  if (isFirst.current) {
    isFirst.current = false;
    let error;
    try {
      prom = cb();
    } catch (err) {
      error = err;
    }
    if (prom) {
      if (typeof prom.then === 'function') {
        let value;
        prom.then(
          v => (value = v),
          err => (error = err),
        );
        if (value != undefined) return { ...result, data: value };
      } else {
        return { ...result, data: prom };
      }
    }
    if (error) {
      return { ...result, error };
    }
  }

  return result;
}
