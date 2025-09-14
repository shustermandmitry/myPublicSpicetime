type Func<R = any, A extends any[] = any[]> = (...args: A) => R;
type CallerFunc<R = any, A extends any[] = any[]> = Func<R, [string[], any, ...A]>;

interface ApiProxy<R extends Func = Func> {
  [name: string]: ApiProxy<R> | R;
}

type ApiMethod<T extends (...a: any[]) => any> = {
  (params: Parameters<T>[0], opts?: any): Promise<ReturnType<T>>;
  get: ApiMethod<T>;
  post: ApiMethod<T>;
  put: ApiMethod<T>;
  delete: ApiMethod<T>;
};

type AnyCaller<T> = {
  [key in keyof any]: key extends keyof T ? any : AnyCaller<any>;
} & ApiMethod<any>;

type ApiCaller<T extends ApiProxy, F extends Func> = {
  [key in keyof T]: T[key] extends Func
    ? ApiMethod<T[key]>
    : T[key] extends ApiProxy
      ? ApiCaller<T[key], F>
      : never;
} & AnyCaller<T>;

const METHODS = ['get', 'post', 'put', 'delete'] as const;
type Method = (typeof METHODS)[number];

function underscoreToDash(str: string) {
  return str.replace('_', '-');
}

export function createApiProxy<T extends ApiProxy, C extends CallerFunc = CallerFunc>(
  path: string[],
  options: any = {},
  caller: C,
): ApiCaller<T, C> {
  const children: Record<string, any> = {};

  // if we have method in path last - dont call as path
  let callPath = path;
  if (METHODS.includes(path[path.length - 1] as Method)) {
    callPath = [...path];
    callPath.pop();
  }

  return new Proxy(() => {}, {
    apply(target: any, thisArg: any, args: any[]): any {
      return caller(callPath, options, ...args);
    },
    get(target: any, name: string, receiver: any) {
      return (
        children[name] ||
        (children[name] = createApiProxy(
          [...path, underscoreToDash(name)],
          METHODS.includes(name as Method) ? { ...options, method: name as Method } : options,
          caller,
        ))
      );
    },
  });
}

// async function main() {
//   interface Query {
//     limit: number;
//     size?: string;
//   }
//
//   const api = createApiProxy<{
//     users: {
//       find(q: Query): string[];
//       find1(q: Query): number[];
//       get: {
//         delete(q: {}): void;
//       };
//     };
//   }>([], {}, (path, ...args) => {
//     console.log('call', path.join('/'), ...args);
//   });
//
//   // const ids = await api.users.find({ limit: 10 });
//   // const ids4 = await api.users.get.delete.delete({ limit: 10 });
//   // const ids2 = await api.users.find1({ limit: 10, size: 'aa', asd: 'aa' }, { p: 1 });
//   // const ids3 = await api.users.find2({ limit: 10, size: 'aa', asd: 'aa' }, { p: 1 });
// }

// main();
