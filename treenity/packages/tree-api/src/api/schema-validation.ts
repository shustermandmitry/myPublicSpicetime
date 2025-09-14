import { Typed, types } from '@treenity/core';
import { SchemaValidationError, validateSchema } from '@treenity/json-schema';

export const validateMetas = async (metas: Typed[]): Promise<SchemaValidationError[]> => {
  const errors: SchemaValidationError[] = [];

  for (const meta of metas) {
    const metaError = await validateMeta(meta);
    errors.push(...metaError);
  }

  return errors;
};

export const validateMeta = async (value: Typed): Promise<SchemaValidationError[]> => {
  const meta = await types.schema.get(value.$type);
  if (!meta) {
    throw new Error('Meta not found: ' + value.$type);
  }

  const [schema] = meta;
  const [isValid, errors] = await validateSchema(value, schema);
  if (isValid) return [];
  return errors!;
};

export const throwIfErrors = (errors: SchemaValidationError[]) => {
  if (errors.length) {
    console.error('Node validation failed:');
    errors.map(err => console.error(err));

    // throw new ValidationError('Node validation failed', errors);
  }
};
