import { Context, ContextImpl, TypeContextInfo } from '@treenity/core';
import { JsonObjectSchema } from './types';

export interface SchemaContextOptions {}

export interface SchemaTypeContext extends Context<JsonObjectSchema, SchemaContextOptions> {}

export type SchemaContextInfo = TypeContextInfo<JsonObjectSchema, SchemaContextOptions>;

export class SchemaTypeContextImpl
  extends ContextImpl<JsonObjectSchema, SchemaContextOptions>
  implements SchemaTypeContext {}

declare module '@treenity/core' {
  export interface ContextTypes {
    schema: SchemaTypeContext;
  }
}

new SchemaTypeContextImpl('schema');
