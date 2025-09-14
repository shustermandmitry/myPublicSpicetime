import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const restServerSchema = {
  $id: 'http_server',
  type: 'object',
  additionalProperties: false,
  required: ['connection'],
  properties: {
    prefix: { type: 'string' },
  },
} as const;

export type RestServerSchema = Meta & FromSchema<typeof restServerSchema>;
