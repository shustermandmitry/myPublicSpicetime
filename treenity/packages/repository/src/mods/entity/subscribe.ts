/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { HookContext, HookFunction, Paginated } from '@feathersjs/feathers';

export const subscribe = (): HookFunction => {
  return async (hookContext: HookContext) => {
    const { params, result } = hookContext;
    // only subscribe for sockets without raw request
    if (
      params.connection?.provider !== 'socketio' ||
      params?.sub !== true ||
      params?.query?.raw ||
      params.raw
    ) {
      return;
    }

    let entities = [];
    if (Array.isArray(result)) {
      entities = result;
    } else if (Array.isArray(result?.data)) {
      const page = result as Paginated<any>;
      entities = page.data;
    } else if (typeof result !== 'undefined') {
      entities = [result];
    }

    entities.forEach((e: any) => {
      if (typeof e.$id === 'string' && typeof e.$type === 'string') {
        hookContext.app.channel(e.$id).join(hookContext.params.connection);
      }
    });
  };
};

export const unsubscribe = (): HookFunction => {
  return async (hookContext: HookContext) => {
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
      return;
    }

    params?.query.ids.forEach(($id: string) => {
      hookContext.app.channel($id).leave(hookContext.params.connection);
    });

    hookContext.result = { unsub: true, ids: params?.query.ids };
  };
};
