// Non-recursive implementation of hooks. To minify call-stacks in development.
import { Deferred, deferred } from '../utils/deferred';

export type NextFunction = () => Promise<any>;

export type AsyncMiddleware<T = any> = (context: T, next: NextFunction) => Promise<any>;
export type Middleware<T = any> = AsyncMiddleware<T>;

export function composeUnfolded<T = any>(middleware: AsyncMiddleware<T>[]) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  // extract middlewares from all composed functions to flatten the stack
  middleware = middleware.map(mid => (mid as any)?.__middleware || mid).flat();

  const composed = async function (this: any, context: T, finalNext?: AsyncMiddleware<T>) {
    const afterNextStack: [Deferred<any>, Promise<any>][] = [];

    const mids = finalNext ? middleware.concat([finalNext]) : middleware;

    let result = undefined,
      error = undefined;

    for (const mid of mids) {
      const nextCalled = deferred();
      const nextDeferred = deferred();

      const next: NextFunction = () => {
        if (nextCalled.state !== 'pending') {
          throw new Error('next called multiple times');
        }
        nextCalled.resolve();
        return nextDeferred;
      };

      const midPromise = mid.call(this, context, next);
      const midWithCatch = midPromise.then(res => (result = res)).catch(err => (error = err));

      await Promise.race([midWithCatch, nextCalled]);
      if (error) break;

      afterNextStack.push([nextDeferred, midPromise]);
    }

    // Resolve all deferred promises in reverse order
    for (let i = afterNextStack.length - 1; i >= 0; i--) {
      const [nextDeferred, prom] = afterNextStack[i];
      // delete afterNextStack[i];
      // we will resolve or reject this nextDeferred here, and wait for its result below when `await prom`
      error ? nextDeferred.reject(error) : nextDeferred.resolve(result);
      error = undefined;
      result = await prom.catch(err => (error = err));
    }

    if (error) throw error;

    return result;
  };

  composed.__middleware = middleware;

  return composed;
}
