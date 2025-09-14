import type { FromSchema } from '@feathersjs/schema';
import { defaultAppSettings, getValidator } from '@feathersjs/schema';

import { dataValidator } from './validators';

export const configurationSchema = {
  $id: 'configuration',
  type: 'object',
  additionalProperties: false,
  required: ['host', 'port', 'public', 'tree'],
  properties: {
    ...defaultAppSettings,
    host: { type: 'string' },
    port: { type: 'number' },
    public: { type: 'string' },
    restApp: { type: 'object' },
    tree: {
      type: 'object',
      additionalProperties: false,
      required: ['root'],
      properties: {
        root: { type: 'string' },
      },
    },
    services: {
      type: 'object',
      additionalProperties: true,
      properties: {},
    },
  },
} as const;

export const configurationValidator = getValidator(configurationSchema, dataValidator);

export type ApplicationConfiguration = FromSchema<typeof configurationSchema>;
