import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const securitySourceSchema = {
  $id: 'security_handler',
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'handler'],
  properties: {
    itemId: { type: 'string' },
    type: { type: 'string' },
    extra: { type: ['object', 'string'] },
  },
} as const;

export type SecuritySourceMeta = Meta & FromSchema<typeof securitySourceSchema>;
