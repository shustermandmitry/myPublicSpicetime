export * from './service';
export { default as awaitService } from './utils/service-awaiter';
export type { Id, NullableId, Application, Paginated } from '@feathersjs/feathers';
export type { FromSchema } from 'json-schema-to-ts';
export * from './feathers';
export * from '@feathersjs/errors';
export * from './service/protected-methods-list';

// explicitlty export to reexport not from feathers
export { Params } from './service';
