import * as feathers from '@feathersjs/feathers';

export * from '@feathersjs/feathers';
// @ts-ignore
const { defaultServiceMethods, defaultServiceEvents, createContext, getServiceOptions, SERVICE } = (
  feathers as any
).default as typeof feathers;

export { defaultServiceMethods, defaultServiceEvents, createContext, getServiceOptions, SERVICE };
