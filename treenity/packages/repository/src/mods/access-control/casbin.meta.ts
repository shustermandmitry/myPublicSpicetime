import { FromSchema } from '@treenity/json-schema';

export const casbinServiceSchema = {
  $id: 'sys.access-control.casbin',
  type: 'object',
  additionalProperties: false,
  required: ['model'],
  properties: {
    model: {
      type: 'object',
      required: [],
      additionalProperties: false,
      properties: {
        request_definition: { type: 'string' },
        policy_definition: { type: 'string' },
        role_definition: { type: 'string' },
        policy_effect: { type: 'string' },
        matchers: { type: 'string' },
      },
    },
  },
} as const;

export type CasbinServiceMeta = FromSchema<typeof casbinServiceSchema>;

export const roleSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
    inheritedFrom: { type: 'string' },
  },
} as const;

export type RoleMeta = FromSchema<typeof roleSchema>;
