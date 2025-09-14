import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const counterSchema = {
  $id: 'counter_service',
  type: 'object',
  additionalProperties: false,
  required: ['servicePath'],
  properties: {
    servicePath: { type: 'string' },
  },
} as const;

export type CounterMeta = Meta & FromSchema<typeof counterSchema>;
