/**
 * Convert class construction to factory function
 * @param cls - class to construct
 * @returns factory function with params matching cls constructor arguments params
 */
export function classFactory<T extends Class<T>, A extends any[]>(
  cls: T,
): (...args: A) => InstanceType<T> {
  return (...args: A) => {
    const instance = new cls(...args);
    return instance;
  };
}

export type Class<T extends abstract new (...args: any) => any = any, A extends any[] = any> = {
  new (...args: A): InstanceType<T>;
};

export type AnyClass = {
  new (...args: any): any;
};
