/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { HookContext, Middleware, NextFunction } from '@feathersjs/hooks';

export const subscribe = (): Middleware => {
  return async (hookContext: HookContext, next: NextFunction) => {
    const { params, result } = hookContext;
    // only subscribe for sockets without raw request
    if (
      params.connection?.provider !== 'socketio' ||
      params?.sub !== true ||
      params?.query?.raw ||
      params.raw
    ) {
      return next();
    }

    await next();

    let entities;
    if (Array.isArray(result)) {
      entities = result;
    } else if (Array.isArray(result.data)) {
      entities = result.data;
    } else {
      entities = [result];
    }

    entities.forEach((e: any) => {
      if (typeof e.$id === 'string' && typeof e.$type === 'string') {
        hookContext.manager.subscribe(e.$id, hookContext.connection);
      }
    });
  };
};

export const unsubscribe = (): Middleware => {
  return async (hookContext: HookContext, next: NextFunction) => {
    const { params } = hookContext;

    params.sub = params.query?.$sub;
    delete params?.query?.$sub;
    params.unsub = params.query?.$unsub;
    delete params?.query?.$unsub;
    // only unsubscribe for sockets
    if (
      params.connection?.provider !== 'socketio' ||
      params.unsub !== true ||
      !Array.isArray(params?.query.ids)
    ) {
      return next();
    }

    params?.query.ids.forEach((entityId: string) => {
      hookContext.manager.unsubscribe(entityId, hookContext.connection);
    });

    hookContext.result = { unsub: true, ids: params?.query.ids };

    return next();
  };
};
