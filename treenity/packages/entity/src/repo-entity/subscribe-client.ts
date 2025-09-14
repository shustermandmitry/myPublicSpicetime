/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { HookContext, Middleware, NextFunction } from '@feathersjs/hooks';

export const rewriteSubParam = (): Middleware => {
  return async (hookContext: HookContext, next: NextFunction) => {
    const { params } = hookContext;
    // unify params if any and send over the wire in query
    if (params.sub || params.query?.sub) (params.query ||= {}).$sub = true;
    if (params.unsub || params.query?.unsub) (params.query ||= {}).$unsub = true;

    return next();
  };
};
