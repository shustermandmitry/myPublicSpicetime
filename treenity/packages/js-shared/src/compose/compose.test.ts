import { compose, NextFunction } from './compose';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 0));
}

function isPromise(x: any) {
  return x && typeof x.then === 'function';
}

describe('compose', () => {
  it('should work', async () => {
    const arr: number[] = [];
    const stack = [];

    stack.push(async (_context: any, next: NextFunction) => {
      arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      arr.push(6);
    });

    stack.push(async (_context: any, next: NextFunction) => {
      arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      arr.push(5);
    });

    stack.push(async (_context: any, next: NextFunction) => {
      arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      arr.push(4);
    });

    await compose(stack)({});

    expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should be able to be called twice', async () => {
    const stack = [];

    stack.push(async (context: any, next: NextFunction) => {
      context.arr.push(1);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(6);
    });

    stack.push(async (context: any, next: NextFunction) => {
      context.arr.push(2);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(5);
    });

    stack.push(async (context: any, next: NextFunction) => {
      context.arr.push(3);
      await wait(1);
      await next();
      await wait(1);
      context.arr.push(4);
    });

    const fn = compose(stack);
    const ctx1: any = { arr: [] };
    const ctx2: any = { arr: [] };
    const out = [1, 2, 3, 4, 5, 6];

    await fn(ctx1);
    expect(ctx1.arr).toEqual(out);
    await fn(ctx2);
    expect(ctx2.arr).toEqual(out);
  });

  it('should only accept an array', async () => {
    // @ts-ignore test without args
    expect(() => compose()).toThrow('Middleware stack must be an array!');
  });

  it('should create next functions that return a Promise', async () => {
    const stack = [];
    const arr: any = [];
    for (let i = 0; i < 5; i++) {
      stack.push(async (_context: any, next: NextFunction) => {
        arr.push(next());
      });
    }

    await compose(stack)({});

    for (const next of arr) {
      expect(isPromise(next)).toBe(true);
    }
  });

  it('should work with 0 middleware', async () => {
    await compose([])({});
  });

  it('should only accept middleware as functions', () => {
    expect(() => compose([{}] as any)).toThrow('Middleware must be composed of functions!');
  });

  it('should work when yielding at the end of the stack', async () => {
    const stack = [];
    let called = false;

    stack.push(async (_ctx: any, next: NextFunction) => {
      await next();
      called = true;
    });

    await compose(stack)({});
    expect(called).toBe(true);
  });

  it('should reject on errors in middleware', async () => {
    const stack = [];

    stack.push(() => {
      throw new Error();
    });

    await expect(compose(stack)({})).rejects.toThrow();
  });

  it('should keep the context', async () => {
    const ctx = {};

    const stack = [];

    stack.push(async (ctx2: any, next: NextFunction) => {
      await next();
      expect(ctx2).toBe(ctx);
    });

    stack.push(async (ctx2: any, next: NextFunction) => {
      await next();
      expect(ctx2).toBe(ctx);
    });

    stack.push(async (ctx2: any, next: NextFunction) => {
      await next();
      expect(ctx2).toBe(ctx);
    });

    await compose(stack)(ctx);
  });

  it('should catch downstream errors', async () => {
    const arr: number[] = [];
    const stack = [];

    stack.push(async (_ctx: any, next: NextFunction) => {
      arr.push(1);
      try {
        arr.push(6);
        await next();
        arr.push(7);
      } catch (_err) {
        arr.push(2);
      }
      arr.push(3);
    });

    stack.push(async (_ctx: any, _next: NextFunction) => {
      arr.push(4);
      throw new Error();
    });

    await compose(stack)({});
    expect(arr).toEqual([1, 6, 4, 2, 3]);
  });

  it('should compose w/ next', async () => {
    let called = false;

    await compose([])({}, async () => {
      called = true;
    });

    expect(called).toBe(true);
  });

  it('should handle errors in wrapped non-async functions', async () => {
    const stack = [];

    stack.push(function () {
      throw new Error();
    });

    await expect(compose(stack)({})).rejects.toThrow();
  });

  it('should compose w/ other compositions', async () => {
    const called: number[] = [];

    await compose([
      compose([
        (_ctx, next) => {
          called.push(1);
          return next();
        },
        (_ctx, next) => {
          called.push(2);
          return next();
        },
      ]),
      (_ctx, next) => {
        called.push(3);
        return next();
      },
    ])({});

    expect(called).toEqual([1, 2, 3]);
  });

  it('should throw if next() is called multiple times', async () => {
    await expect(
      compose([
        async (_ctx, next) => {
          await next();
          await next();
        },
      ])({}),
    ).rejects.toThrow(/multiple times/);
  });

  it('should return a valid middleware', async () => {
    let val = 0;
    await compose([
      compose([
        (_ctx, next) => {
          val++;
          return next();
        },
        (_ctx, next) => {
          val++;
          return next();
        },
      ]),
      (_ctx, next) => {
        val++;
        return next();
      },
    ])({});

    expect(val).toBe(3);
  });

  it('should return last return value', async () => {
    const stack = [];

    stack.push(async (_context: any, next: NextFunction) => {
      const val = await next();
      expect(val).toBe(2);
      return 1;
    });

    stack.push(async (_context: any, next: NextFunction) => {
      const val = await next();
      expect(val).toBe(0);
      return 2;
    });

    const next = async () => 0;

    const val = await compose(stack)({}, next);
    expect(val).toBe(1);
  });

  it('should not affect the original middleware array', () => {
    const middleware = [];
    const fn1 = (_ctx: any, next: NextFunction) => {
      return next();
    };
    middleware.push(fn1);

    for (const fn of middleware) {
      expect(fn).toBe(fn1);
    }

    compose(middleware);

    for (const fn of middleware) {
      expect(fn).toBe(fn1);
    }
  });

  it('should not get stuck on the passed in next', async () => {
    const middleware = [
      (_ctx: any, next: NextFunction) => {
        ctx.middleware++;
        return next();
      },
    ];
    const ctx = {
      middleware: 0,
      next: 0,
    };

    await compose(middleware)(ctx, async (ctx: any, next: NextFunction) => {
      ctx.next++;
      return next();
    });

    expect(ctx).toEqual({ middleware: 1, next: 1 });
  });

  it('should run without next', async () => {
    const middleware = async (_ctx: any, _next: NextFunction) => {
      ctx.middleware++;
    };
    const ctx = {
      middleware: 0,
      next: 0,
    };

    await compose([middleware, middleware])(ctx, async (ctx: any, _next: NextFunction) => {
      ctx.next++;
    });

    expect(ctx).toEqual({ middleware: 2, next: 1 });
  });
});
