/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { HookContext, HookFunction } from '@feathersjs/feathers';

export const rewriteSubParam = (): HookFunction => {
  return async (hookContext: HookContext) => {
    const { params } = hookContext;
    // unify params if any and send over the wire in query
    if (params.sub || params.query?.sub) (params.query ||= {}).$sub = true;
    if (params.unsub || params.query?.unsub) (params.query ||= {}).$unsub = true;
  };
};
