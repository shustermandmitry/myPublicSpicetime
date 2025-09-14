import type { AroundHookFunction, HookContext, NextFunction } from '@feathersjs/feathers';
import { metaType } from '@treenity/core';
import { convertResultToEntity, EntityActions, EntityManager, isEntity } from '@treenity/entity';
import { ClientOrServer, makeServiceActions } from './service-entity-actions';

/**
 *
 * @param context
 * @param manager - the EntityManager to create entities on
 */
export const deserializeEntityHook = (
  context: ClientOrServer,
  manager?: EntityManager,
): AroundHookFunction => {
  manager ??= new EntityManager(context);

  return async (hookContext: HookContext, next?: NextFunction) => {
    // don't deserialize entities for raw services
    const { params, service } = hookContext;
    if (!params.entity || (params.provider || params.connection?.provider) === 'socketio') {
      return next?.();
    }

    delete params.entity;

    next && (await next());

    const { result } = hookContext;
    if (!result || (Array.isArray(result) && !result.length)) return;

    // cache actions on the service
    const actions =
      service.$actions ||
      Object.defineProperty(service, '$actions', {
        value: makeServiceActions(context, hookContext),
      }).$actions;
    const createEntity = createOrRawEntity.bind(manager, context, actions);
    hookContext.result = await convertResultToEntity(createEntity, result);
  };
};

function createOrRawEntity(
  this: EntityManager,
  context: ClientOrServer,
  actions: EntityActions<any>,
  raw: any,
) {
  return !isEntity(raw) && (raw as any)?.$type
    ? this.ensure(raw, actions, metaType((raw as any).$type).inContext(context))
    : raw;
}
