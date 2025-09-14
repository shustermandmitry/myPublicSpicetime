/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { AsyncMiddleware, HookContext, NextFunction } from '@feathersjs/hooks';
import { metaType } from '@treenity/core';
import { convertResultToEntity } from '../convert-result-to-entity';
import { isEntity } from '../create-entity';
import { EntityActions } from '../entity';
import { EntityManager } from '../entity-manager';

export type ClientOrServer = 'client' | 'server';

/**
 *
 * @param context
 * @param actions
 * @param manager - the EntityManager to create entities on
 */
export const deserializeEntityHook = (
  context: ClientOrServer,
  actions: EntityActions<any>,
  manager?: EntityManager,
): AsyncMiddleware => {
  manager ??= new EntityManager(context);

  return async (hookContext: HookContext, next: NextFunction) => {
    await next();

    const { result } = hookContext;
    if (!result || (Array.isArray(result) && !result.length)) return;

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
