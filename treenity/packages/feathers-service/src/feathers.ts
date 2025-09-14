/*
 * Copyright (c) 2024. Treenity Inc.
 */

import * as feathers from '@feathersjs/feathers';

export type * from '@feathersjs/feathers';

// export * from '@feathersjs/feathers';
// @ts-ignore
const {
  defaultServiceMethods,
  defaultServiceEvents,
  createContext,
  getServiceOptions,
  SERVICE,
  protectedMethods,
  FeathersHookManager
} = ((feathers as any).default as typeof feathers) || feathers;

export {
  defaultServiceMethods,
  defaultServiceEvents,
  createContext,
  getServiceOptions,
  FeathersHookManager,
  SERVICE,
  protectedMethods,
};
