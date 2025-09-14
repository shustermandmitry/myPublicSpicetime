interface Channel<T> extends Promise<T> {}

export const getChannel = <T = any>(func: () => Promise<T>): Channel<T> => {
  return {
    async then(cb: (val: T) => Promise<any> | any, cancel: (arg?: any) => void) {
      try {
        return cb(await func());
      } catch (err) {
        cancel(err);
      }
    },
  } as Channel<T>;
};
