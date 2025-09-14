import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const securityExecutorSchema = {
  $id: 'security_handler',
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'handler'],
  properties: {
    id: { type: 'number' },
    slug: { type: 'string' },
    handler: { type: 'string' },
    generator: { type: 'string' },
    length: { type: 'string' },
    saveKeyAsCode: { type: 'boolean' },
  },
} as const;

export type SecuritySourceMeta = Meta & FromSchema<typeof securityExecutorSchema>;
export type CreateSecurityExecutorMeta = Omit<SecuritySourceMeta, 'id'>;
