export interface Deferred<T = void> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  state: string;
}

export function deferred<T = void>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  }) as Deferred<T>;
  promise.state = 'pending';
  promise.resolve = (res: any) => {
    promise.state = 'resolved';
    return resolve(res);
  };
  promise.reject = (res: any) => {
    promise.state = 'rejected';
    return reject(res);
  };
  return promise;
}
