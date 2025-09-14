export const mapObj = <T = any, R = any>(
  obj: { [key: string]: T },
  cb: (value: T, key: string) => R,
): R[] => Object.keys(obj).map(key => cb(obj[key], key));

export function partialAssign<T extends object, F extends keyof T>(
  dest: any,
  src: T,
  fields: F[],
): Pick<T, F> {
  fields.forEach(field => {
    if (field in src) {
      dest[field] = src[field];
    }
  });
  return dest;
}

type Predicate = (key: string, value: any) => number;

export function splitObject(obj: Record<string, any>, predicate: Predicate): Record<string, any>[] {
  const result: Record<string, any>[] = [{}];

  for (const [key, value] of Object.entries(obj)) {
    const index = predicate(key, value);

    result[index] ||= {};
    result[index][key] = value;
  }

  return result;
}

export function defaults(target: any, source: any): any {
  Object.keys(source).forEach(key => {
    if (target[key] === undefined) {
      target[key] = source[key];
    }
  });
  return target;
}
