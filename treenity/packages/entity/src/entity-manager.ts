import { memoize } from '@s-libs/micro-dash';
import { AnyType, MetaName, metaType } from '@treenity/core';
import { Raw } from '@treenity/js-shared/utils';
import { createEntity } from './create-entity';
import { Entity, EntityActions, IEntityManager } from './entity';

const createNodeCache = <T extends (...args: any[]) => R, R extends Promise<any>>(create: T) => {
  let memo: ReturnType<typeof memoize<T>>;
  const t = ((id, ...args: any[]) =>
    create(id, ...args).then((res: any) => {
      memo.cache.set(id, res);
      return res;
    })) as T;
  return (memo = memoize<T>(t));
};

export class EntityManager implements IEntityManager {
  constructor(public context?: string) {}

  private cache = createNodeCache(
    (
      $id: string,
      data: any,
      actions: EntityActions<any>,
      type: MetaName<any> | undefined,
      manager: EntityManager,
    ) => {
      type = metaType(type ?? data.$type, this.context);
      if (type.$type === 'any') type = metaType(data.$type, this.context);

      return createEntity(type, data, actions).then(entity => {
        entity.$.manager = manager;
        return entity;
      });
    },
  );

  get<T>(entityId: string, type?: MetaName<T>): Entity<T> | undefined {
    const entity = this.cache.cache.get(entityId);
    if (entity?.then) return undefined; // still promise, not resolved

    if (type && entity && !entity.$.type.isEqual(type, false) && type !== AnyType) {
      throw new Error(`Meta type mismatch: expected '${type}', got '${entity.$.type.$type}'`);
    }
    return entity;
  }

  // create or get entity, updating its data;;
  ensure<T>(
    data: { [name: string]: any } & Partial<Raw<NoInfer<T>>>,
    actions: EntityActions<NoInfer<T>>,
    type?: MetaName<T>,
  ): Promise<Entity<T>> {
    const rawData = data as any;

    if (!rawData.$id) throw new Error('no id defined on entity data');
    if (process.env.NODE_ENV === 'development' && type) {
      if (!metaType(type).isEqual(rawData.$type, false)) {
        console.warn(`Meta type mismatch: expected '${type}', got '${rawData.$type}'`);
      }
    }

    return this.cache(rawData.$id, data, actions, type, this);
  }
}
