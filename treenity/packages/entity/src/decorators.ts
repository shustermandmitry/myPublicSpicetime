import { applyPatch, Operation } from 'fast-json-patch';
import { action } from 'mobx';
import { convertResultToEntity } from './convert-result-to-entity';
import { Entity } from './entity';
import '@treenity/json-schema';
import { deepObserveWithUndoRedoPatches } from './undo-redo/patch';
import { adaptMethodDecorator } from './utils/decorator-wrappers';

export { entity } from './decorators-entity';

declare global {
  interface SymbolConstructor {
    readonly metadata: unique symbol;
  }
}

export const PROTECTED_METHODS = new Set<string | symbol>([
  'handle',
  'set',
  'raw',
  'service',
  'services',
  'events',
  'splice',
  'then',
  'catch',
]);

(Symbol as any).metadata ??= Symbol.for('Symbol.metadata');

const createEntity =
  <T = any>(self: Entity<T>) =>
  (raw: any) => {
    // try first get from cache
    const entity = self.$.manager.get(raw.$id, raw.$type);
    if (entity) return Promise.resolve(entity as T);

    // create entity with the same actions, so connecting it to the same service by default
    return self.$.manager.ensure(raw, self.$.actions, raw.$type) as Promise<T>;
  };

const DECORATORS_APPLIED = Symbol.for('treenity.entity.decorators-applied');

function saveInfo(context: any, originalMethod: Function): void {
  if (!(originalMethod as any)[DECORATORS_APPLIED]) {
    const argsCount = originalMethod.length;
    const methods: Record<string, any> = (context.metadata.methods ??= {});
    methods[context.name as string] = { argsCount };
  }
}

function remoteMethodDecorator(
  originalMethod: Function,
  context: ClassMethodDecoratorContext,
): any {
  if ((typeof context.name as any) === 'symbol' || context.static) {
    throw new Error('method should be instance method');
  }
  const methodName = context.name as string;
  if (PROTECTED_METHODS.has(methodName)) {
    throw new Error(`method ${methodName} should be instance method`);
  }

  saveInfo(context, originalMethod);

  let logWarn = (e: any) => console.warn(`error in optimistic method ${methodName}`, e);

  const decorated = function (this: Entity<any>, ...args: any[]) {
    let optimistic;
    try {
      optimistic = originalMethod.apply(this, args);
    } catch (err) {
      optimistic = Promise.reject(err);
    }

    // log any errors for optimistic
    optimistic?.catch((err: Error) => {
      // just warn here, it is only optimistic method
      logWarn(err);
    });

    // Bad to check this context here, but no other way to decline entity creation
    const dontConvert = typeof args.at(-1) === 'object' && args.at(-1).entity === false;
    const convertToEntity = dontConvert
      ? (e: any) => e
      : convertResultToEntity.bind(null, createEntity(this));

    // if execute exists or not server context - try to use executed value
    if (this.$.actions.execute && this.$.type.$context !== 'server') {
      const exec = this.$.actions.execute(this, methodName, args);
      return exec;
      // if (exec) {
      //   // yes, we will use some result from execute - throw out error and result of optimistic
      //   return exec.then(convertToEntity);
      // }
    }
    return Promise.resolve(optimistic).then(convertToEntity);
  };
  return Object.assign(decorated, {
    [DECORATORS_APPLIED]: true,
  });
}

/**
 * entity method decorator,
 * decorate method to be executed on the main entity (server side)
 * @example ```
 * class ... {
 *   @method
 *   async find(value: string): Promise<Node> {
 *
 */
export const method = adaptMethodDecorator(remoteMethodDecorator);

const makeWriteDecorated = (originalAction: Function, methodName: string) =>
  async function (this: Entity<any>, ...args: any[]): Promise<any> {
    // and on server also collect patches and call patch method
    const { actions, type, options } = this.$;
    if (actions.patch && type.$context === 'server') {
      let undos: Operation[] | undefined;
      let redos: Operation[] | undefined;

      const dispose = deepObserveWithUndoRedoPatches(this, (undo, redo) => {
        undos = undo;
        redos = redo;
      });

      const res = originalAction.apply(this, args);
      dispose();

      if (redos?.length) {
        const argsCount = options?.methods?.[methodName]?.argsCount || 0;
        const ctx = args.length > argsCount ? args.at(-1) : { params: { query: {} } };

        this.$.raw = applyPatch(this.$.raw, redos).newDocument;

        await actions.patch!(this, redos, ctx);
      }

      return res;
    } else {
      return originalAction.apply(this, args);
    }
  };

// export const write = action as ClassMethodDecorator;
function writeDecorator(originalMethod: Function, context: ClassMethodDecoratorContext): any {
  const originalAction = action(originalMethod, context);
  const methodName = context.name as string;

  saveInfo(context, originalMethod);

  return Object.assign(makeWriteDecorated(originalAction, methodName), {
    [DECORATORS_APPLIED]: true,
  });
}

export const write = adaptMethodDecorator(writeDecorator);

export const writeMethod = adaptMethodDecorator(
  (originalMethod: Function, context: ClassMethodDecoratorContext) =>
    writeDecorator(remoteMethodDecorator(originalMethod, context), context),
);
