import { FromSchema } from '@feathersjs/schema';
import { Meta } from '@treenity/core';
import { JsonObjectSchema } from '@treenity/json-schema';

export const roleSchema: JsonObjectSchema = {
  $id: 'sys.access-control.role',
  type: 'object',
  additionalProperties: false,
  required: ['role'],
  properties: {
    role: { type: 'string' },
    inheritedFrom: { type: 'string' },
  },
} as const;

export type RoleMeta = Meta & FromSchema<typeof roleSchema>;
export type RoleMeta2 = FromSchema<typeof roleSchema>;
