import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const sessionServiceSchema = {
  $id: 'sys.session',
  type: 'object',
  additionalProperties: false,
  required: ['storageServicePath', 'expiresIn'],
  properties: {
    storageServicePath: { type: 'string' },
    expiresIn: { type: ['string', 'number'] },
  },
} as const;

export type SessionServiceMeta = Meta & FromSchema<typeof sessionServiceSchema>;
