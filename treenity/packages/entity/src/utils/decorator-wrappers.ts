import { ClassMethodDecorator } from 'mobx/dist/types/decorator_fills';

/**
 * detect which version of decorators currently used
 */
const isTS5Decorators = (ctx?: any) => {
  return !!ctx && typeof ctx.kind !== 'undefined';
};

// type Context = {
//   kind: string;
//   name: string | symbol;
//   access?: { get: () => unknown; set: (value: unknown) => void };
//   static?: boolean;
//   private?: boolean;
//   addInitializer?: (init: () => void) => void;
// };

function ensureMetadata(target: any) {
  let metadata = Object.hasOwn(target, Symbol.metadata) && target[Symbol.metadata];
  if (!metadata) {
    metadata = {};
    Object.defineProperty(target, Symbol.metadata, {
      configurable: true,
      writable: true,
      value: metadata,
    });
  }
  return metadata;
}

/**
 * Wraps a TypeScript 5 class decorator to be compatible with older versions of TypeScript.
 *
 * @param ts5Decorator - The TypeScript 5 class decorator to adapt.
 * @returns A decorator function that can be used with older versions of TypeScript.
 */
export const wrapClassDecorator = (
  ts5Decorator: (value: Function, ctx: ClassDecoratorContext) => any,
): any => {
  return (target: abstract new (...args: any) => any, ctx?: any) => {
    if (isTS5Decorators(ctx)) return ts5Decorator(target, ctx);
    return ts5Decorator(target, {
      kind: 'class',
      name: target.name,
      metadata: ensureMetadata(target as any),
      addInitializer: init => init.call(target),
    });
  };
};

/**
 * Adapts a TypeScript 5 method decorator to be compatible with older versions of TypeScript.
 *
 * @param ts5Decorator - The TypeScript 5 method decorator to adapt.
 * @returns A decorator function that can be used with older versions of TypeScript.
 */
export const adaptMethodDecorator = (ts5Decorator: ClassMethodDecorator): any => {
  return (target: any, key: string | symbol, desc: PropertyDescriptor) => {
    if (isTS5Decorators(key)) return ts5Decorator(target, key as any);

    const result = ts5Decorator(desc.value, {
      kind: 'method',
      name: key,
      static: target === target.constructor,
      private: key.toString().startsWith('#'),
      access: null!,
      metadata: ensureMetadata(target),
      // access: {
      //   get: () => desc.value,
      //   set: v => (desc.value = v),
      // },
      addInitializer: init => {
        throw new Error('not implemented');
      },
    });
    if (result) desc.value = result;
    return desc;
  };
};

// export const wrapProperty = (ts5Decorator: (value: undefined, ctx: Context) => any) => {
//   if (isTS5Decorators()) return ts5Decorator;
//
//   return (target: any, key: string | symbol) => {
//     let value: any;
//     const inits: Array<() => void> = [];
//     const result = ts5Decorator(undefined, {
//       kind: 'field',
//       name: key,
//       static: target === target.constructor,
//       private: key.toString().startsWith('#'),
//       access: {
//         get: () => value,
//         set: v => (value = v),
//       },
//       addInitializer: init => inits.push(init),
//     });
//
//     Object.defineProperty(target, key, {
//       get() {
//         while (inits.length) inits.shift()?.call(this);
//         return result?.get?.call(this) ?? value;
//       },
//       set(v) {
//         result?.set ? result.set.call(this, v) : (value = v);
//       },
//       enumerable: true,
//       configurable: true,
//     });
//   };
// };
