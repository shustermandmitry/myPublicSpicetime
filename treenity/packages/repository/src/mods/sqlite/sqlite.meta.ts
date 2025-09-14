import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const SqliteServiceSchema = {
  $id: 'db.sqlite',
  type: 'object',
  additionalProperties: false,
  required: ['tableName'],
  properties: {
    tableName: { type: 'string' },
  },
} as const;
export type SqliteServiceMeta = Meta & FromSchema<typeof SqliteServiceSchema>;
