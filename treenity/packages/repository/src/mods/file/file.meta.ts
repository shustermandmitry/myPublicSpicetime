import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const fileSchema = {
  $id: 'file',
  type: 'object',
  additionalProperties: false,
  required: ['servicePath'],
  properties: {
    servicePath: { type: 'string' },
  },
} as const;

export type FileMeta = Meta & FromSchema<typeof fileSchema>;
