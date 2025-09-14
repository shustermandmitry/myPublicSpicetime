/*
 * Copyright (c) 2024. Treenity Inc.
 */

/**
 * TODO: mapChain (for parallel async resolve in objects and arrays)
 * TODO: fix nullable chaining
 * TODO: add SWR options
 * TODO: add tests with examples
 */

import { LRUCache } from 'lru-cache';
import { SWRResponse } from 'swr';

import { callChainMixins, defineMixin } from './mixins';
import { CallChain, ChainState, PathSection } from './types';
import Deferred from './utils/deferred';

const TARGET_ID = Symbol('target_id');
let nextId = 0;

function getTargetId(target: any): string {
  if (typeof target !== 'object') {
    return `${target}`;
  }
  if (!(TARGET_ID in target)) {
    Object.defineProperty(target, TARGET_ID, {
      value: (++nextId).toString(),
      enumerable: false,
      writable: false,
    });
  }
  return target[TARGET_ID];
}

// Cache for storing proxy results
const resultCache = new LRUCache<string, any>({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 5, // Items expire after 5 minutes
});

const sectionToString = (p: PathSection) =>
  typeof p === 'string' ? p : `(${p.map((p: any) => JSON.stringify(p)).join(', ')})`;

function pathToString(path: Array<any>, i: number): string {
  return path.slice(0, i).map(sectionToString).join('.');
}

function resolveUndefined(state: ChainState, params: FallbackParams): any {
  const { last, p: field } = params;
  const mixin = (callChainMixins as any)[`_${field}_`];
  if (mixin) {
    const next = getStateNext(state, field + '-mixin');
    // next.target ??= last;
    return (next.proxy ??= mixin);
  }
  console.log('trying to resolveUndefined', field, 'on', last);
  // if (typeof last?.load === 'function' && last?.isLoaded === false) {
  //   return last.load()?.then(() => last[field]);
  // }
}
////////////////////////// MIXINS //////////////////////////
declare module './mixins' {
  export interface CallChainMixins<T> {
    then(resolve: (res: T) => void, reject?: (error: any) => any): Promise<T>;
  }
}

async function processPath(state: ChainState) {
  const { target, path } = state;

  let last = target;
  let prev = target;
  let values;
  if (process.env.NODE_ENV !== 'production') {
    values ??= [];
    values.push(last);
  }

  for (let i = 0; i < path.length; i++) {
    let p = path[i];
    if (last == null) {
      throw new Error(`cannot resolve '${p}' on '${last}' in path ${pathToString(path, i)}`);
    }

    // console.log('last', last, p);
    if (typeof p === 'string') {
      // if it's a string, then it's a field
      prev = last;
      if (last[p] === undefined) {
        last = resolveUndefined(state, last, p, i); // CallChainMixins.resolve(last, p);
      } else {
        last = last[p];
      }
    } else {
      // if it's not a string, then it's a method
      last = last.apply(prev, p);
      // if it's a promise, then await it
    }
    if (typeof last === 'object' && 'then' in last) {
      last = await last;
    }
  }

  return last;
}


defineMixin({
  async then(this: ChainState, resolve: (res: any) => any, reject?: (error: any) => any) {
    const { target, path, key } = this;

    const cacheKey = key + ':then-mixin';
    const cachedResult = resultCache.get(cacheKey);

    if (cachedResult !== undefined) {
      return resolve(cachedResult);
    }

    let last = target;
    let prev = target;
    let values;
    if (process.env.NODE_ENV !== 'production') {
      values ??= [];
      values.push(last);
    }
    let i = 0;
    try {
      for (; i < path.length; i++) {
        let p = path[i];
        if (last == null) {
          throw new Error(`cannot resolve '${p}' on '${last}' in path ${pathToString(path, i)}`);
        }

        // console.log('last', last, p);
        if (typeof p === 'string') {
          // if it's a string, then it's a field
          prev = last;
          if (last[p] === undefined) {
            const fallbackParams = {
              last,
              p,
              idx: i,
              final: this.opts.fallbackFinal,
            } satisfies FallbackParams;
            last =
              (await this.opts.fallback?.(this, fallbackParams)) ??
              resolveUndefined(this, fallbackParams); // CallChainMixins.resolve(last, p);
            if (fallbackParams.final)
              i = path.length; // like break, but we will finish the loop and resolve if last is promise
            else i = fallbackParams.idx; // copy it back, if it was changed by fallback
          } else {
            last = last[p];
          }
        } else {
          // if it's not a string, then it's a method
          last = last.apply(prev, p);
          // if it's a promise, then await it
        }
        if (last && typeof last === 'object' && 'then' in last) {
          last = await last;
        }
      }

      resultCache.set(cacheKey, last);
      return resolve(last);
    } catch (e: any) {
      const error = new CallChainError(
        `Error in chain at path ${pathToString(path, i)}: ${e.stack}`,
        path,
        e,
      );
      if (reject) return reject(error);
      throw error;
    }
  },
});

////////////////////////// MIXINS //////////////////////////

function makeStateNext(parent: ChainState, next: PathSection, key: string): ChainState {
  const path = [...parent.path, next];
  const s = {
    target: parent.target,
    parent,
    path,
    opts: parent.opts,
    key,
    proxy: null!,
    cache: resultCache as Map<string, any>,
  } satisfies ChainState;
  return Object.assign(() => s, s);
}

function getStateNext(parent: ChainState, next: PathSection): ChainState {
  const key = parent.key + ':' + sectionToString(next);
  let value;
  return (
    parent.cache.get(key) ??
    (parent.cache.set(key, (value = makeStateNext(parent, next, key))), value)
  );
}

function makeStateTarget(parent: ChainState, target: any, opts: any): ChainState {
  const s = {
    target,
    parent,
    path: [],
    key: parent.key + ':' + getTargetId(target),
    proxy: null!,
    cache: resultCache as Map<string, any>,
    opts,
  } satisfies ChainState;
  return Object.assign(() => s, s);
}

function getStateTarget(parent: ChainState, target: any, opts: any): ChainState {
  const key = parent.key + ':' + getTargetId(target);
  let value;
  return (
    parent.cache.get(key) ??
    (parent.cache.set(key, (value = makeStateTarget(parent, target, opts))), value)
  );
}

export const CHAIN_STATE = Symbol('chain_state');

const proxyHandler: ProxyHandler<ChainState> = {
  get(chainState: ChainState, name: string | symbol) {
    if (name === 'then' || name in callChainMixins) {
      const state = getStateNext(chainState, name as string);

      return (state.proxy ??= (callChainMixins as any)[name].bind(chainState));
    }

    if ((typeof name as any) === 'symbol') {
      if (name === CHAIN_STATE) return chainState;
      return undefined;
    }

    return chainCallRecurse(chainState, name as string);
  },
  apply(chainState, name, params) {
    return chainCallRecurse(chainState, params);
  },
};

function chainCallRecurse<T = {}>(parent: ChainState, next: PathSection): CallChain<T> {
  const state = getStateNext(parent, next);
  return (state.proxy ??= new Proxy(state, proxyHandler) as unknown as CallChain<T>);
}

const rootState: ChainState = makeStateTarget({ key: '' } as ChainState, {}, {});
rootState.key = '';

export interface FallbackParams {
  last: any;
  p: string;
  idx: number;
  final?: boolean;
}

interface CallChainOptions {
  key?: string;
  fallback?: (chainState: ChainState, params: any) => any;
  /**
   * If true, the fallback call will be the final call, and it's result will be returned
   * as the result of full chain call, but if faallbackFinal is false, then after fallback
   * return the value, the chain will continue to call the next method in the call path.
   */
  fallbackFinal?: boolean;
}

export function chainCall<T = {}>(target: T, options: CallChainOptions = {}): CallChain<T> {
  const state = getStateTarget(rootState, target, options);
  return (state.proxy ??= new Proxy(state, proxyHandler) as unknown as CallChain<T>);
}

export function pathToChain<T = {}>(
  firstState: ChainState,
  path: PathSection[],
  // opts?: CallChainOptions,
): CallChain<T> {
  let state = firstState;
  for (let i = 0; i < path.length; i++) {
    state = getStateNext(state, path[i]);
  }
  return (state.proxy ??= new Proxy(state, proxyHandler) as unknown as CallChain<T>);
}

export function isChain<T = any>(obj: any): obj is CallChain<T> {
  return typeof obj === 'function' && obj[CHAIN_STATE];
}

export function chainState(obj: CallChain<any>): ChainState {
  return obj[CHAIN_STATE];
}

export { chainCall as $ };

/**
 * type FirstGenericArgument<T, A> = T extends (...args: any[]) => any
 *   ? T extends <A>(...args: any[]) => A
 *     ? A
 *     : never
 *   : never;

 * @example
 * ```ts
 * interface IEventMeta {
 *   age: number;
 *   bot: {
 *     test(): Promise<string>;
 *     testObj(): Promise<{ x: string }>;
 *   };
 *   getEvent(type: { active: boolean }): Promise<IEventMeta>;
 * }

 * const nodeEntity = chainCall({
 *   getEvent: async (type: { active: boolean }): Promise<IEventMeta> => {
 *     return {
 *       age: 10,
 *       bot: {
 *         async test() {
 *           return 'abc';
 *         },
 *         async testObj() {
 *           return { x: 'hello world' };
 *         },
 *       },
 *       async getEvent(type: { active: boolean }): Promise<IEventMeta> {
 *         return null!;  *this;
 *       },
 *     };
 *   },
 * });
 *
 * async function test() {
 *   const event = await nodeEntity.getEvent({ active: true });
 *   const x = await event.bot.test();
 *
 *   const bot = await nodeEntity.getEvent({ active: true }).bot;
 *   const botTest = await bot.test();
 *   const age = await nodeEntity.getEvent({ active: true }).age;
 *   const obj = await nodeEntity.getEvent({ active: true }).bot.testObj();
 *   const obj2 = await nodeEntity
 *     .getEvent({ active: true })
 *     .getEvent({ active: true })
 *     .getEvent({ active: true });
 *
 *   const y = await nodeEntity.getEvent({ active: true }).bot.test();
 *
 *
 * interface IObj {
 *   obj: number;
 * }
 *
 * const numPromise: Promise<number> & number = null!;
 * const num = await numPromise;
 *
 * const objPromise: Promise<IObj> & IObj = null!;
 * const obj = await objPromise;
 * }
 * ```
 */

// Add a custom error class for better error handling
export class CallChainError extends Error {
  constructor(
    message: string,
    public readonly path: PathSection[],
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'CallChainError';
  }
}
