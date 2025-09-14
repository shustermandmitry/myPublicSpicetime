import { ErrorObject } from 'ajv';

import type { SomeJSONSchema } from 'ajv/lib/types/json-schema';
import type { JSONSchema, FromSchema } from 'json-schema-to-ts';

export type { JSONSchema7TypeName, JSONSchema7 } from 'json-schema';

export type JsonObjectSchema = SomeJSONSchema & JSONSchema;

export interface SchemaValidationError extends ErrorObject {}

export class ValidationError extends Error {
  name: string = 'ValidationError';
  errors: SchemaValidationError[];

  constructor(message: string, errors: SchemaValidationError[]) {
    super(message);
    this.errors = errors;
  }
}

export { FromSchema };
