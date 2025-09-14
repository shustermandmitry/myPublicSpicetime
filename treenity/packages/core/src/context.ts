import { SynchronousPromise } from 'synchronous-promise';
import { ReactTypeContext } from './contexts/react-context';
import { getTypeCache } from './get-type-cache';

import { MetaName, metaType, MetaType } from './meta-type';

export interface TypeContextInfo<C, O> {
  id: string;
  context: string;
  subContext: string;
  component: C;
  options: O;
}

export const registerComp =
  <T>(type: MetaName<T>, component: any) =>
  (ctx: ReactTypeContext) =>
    ctx.add(type, component, { replace: true });

export interface Context<C, O> {
  name: string;
  items: Map<string, TypeContextInfo<C, O>>;

  add<T, C1 extends C>(typeName: MetaName<T>, component: C1, options?: O): TypeContextInfo<C, O>;
  add<T, C1 extends C>(
    subContext: string,
    typeName: MetaName<T>,
    component: C1,
    options?: O,
  ): TypeContextInfo<C, O>;

  get<T>(typeName: MetaName<T>): Promise<[C, O]>;
  get<T>(subContext: string, typeName: MetaName<T>): Promise<[C, O]>;

  getInfo<T>(typeName: MetaName<T>): Promise<TypeContextInfo<C, O>>;
  getInfo<T>(subContext: string, typeName: MetaName<T>): Promise<TypeContextInfo<C, O>>;

  getSync<T>(typeName: MetaName<T>): TypeContextInfo<C, O> | undefined;
  getSync<T>(subContext: string, typeName: MetaName<T>): TypeContextInfo<C, O> | undefined;

  search(query: string): Promise<TypeContextInfo<C, O>[]>;
  search(subContext: string, query: string): Promise<TypeContextInfo<C, O>[]>;
}

function nameToStr(typeName: string | { $item?: unknown; $type: string }): string {
  return typeof typeName === 'string' ? typeName : typeName.$type;
}

export class ContextImpl<C, O> implements Context<C, O> {
  items: Map<string, TypeContextInfo<C, O>> = new Map();

  constructor(public name: string) {
    getTypeCache()[name] = this;
  }

  // add(...args: Pro<Context<C, O>['add']>): TypeContextInfo<C, O>;
  // add(...args: ArgumentTypes<Context<C, O>['add']>): TypeContextInfo<C, O> {
  add(...args: any[]): TypeContextInfo<C, O> {
    if (args.length <= 3) args.unshift(undefined);
    let [subContext, typeName, component, options = {} as O] = args as Parameters<
      Context<C, O>['add']
    >;
    typeName = metaType(typeName, subContext);
    const contextType = typeName.$id;
    const t: TypeContextInfo<C, O> = {
      id: contextType,
      context: this.name,
      subContext,
      component,
      options,
    };

    if (!(options as any).replace && this.items.has(contextType)) {
      console.warn('Type of', contextType, 'in context', this.name, 'already exists');
    } else {
      this.items.set(contextType, t);
    }

    return t;
  }
  metaType<T>(subContext: string, typeName?: MetaName<T>): MetaType<any> {
    if (!typeName) {
      typeName = subContext;
      subContext = undefined!;
    }
    return metaType(typeName, subContext);
  }

  // get(typeName: string): Promise<TypeContextInfo<C, O>>;
  // get(subContext: string, typeName: string): Promise<TypeContextInfo<C, O>>;
  getInfo<T>(subContext: string, typeName?: MetaName<T>): Promise<TypeContextInfo<C, O>> {
    const item = this.getSync(subContext, typeName);
    if (!item) {
      return SynchronousPromise.reject<TypeContextInfo<C, O>>(
        new Error(
          'not found: ' + this.metaType(subContext, typeName).$id + ' in ' + this.name + ' context',
        ),
      );
    }
    return SynchronousPromise.resolve(item);
  }

  getSync<T>(subContext: string, typeName?: MetaName<T>): TypeContextInfo<C, O> | undefined {
    const type = this.metaType(subContext, typeName);
    const item = this.items.get(type.$id);

    return item;
  }

  get<T>(subContext: string, typeName?: MetaName<T>): Promise<[C, O]> {
    return this.getInfo(subContext, typeName).then(({ component, options }) => [
      component,
      options,
    ]);
  }

  async search(subContext: string, query?: string): Promise<TypeContextInfo<C, O>[]> {
    const result: TypeContextInfo<C, O>[] = [];

    if (!query) {
      query = subContext;
      subContext = undefined!;
    }

    for (let t of Array.from(this.items.values())) {
      const subEqual = (!t.subContext && !subContext) || t.subContext === subContext;
      if (subEqual && t.id.includes(query)) {
        result.push(t);
      }
    }
    return result;
  }
}

// Node engine script context type
