import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const shortLinkSchema = {
  $id: 'short_link',
  type: 'object',
  additionalProperties: false,
  required: ['link', 'code'],
  properties: {
    id: { type: 'number' },
    createdAt: { type: 'string', format: 'date' },
    updatedAt: { type: 'string', format: 'date' },
    deletedAt: { type: 'string', format: 'date' },
    link: { type: 'string' },
    code: { type: 'string' },
    tags: { type: 'array', default: [] },
    description: { type: 'string' },
    count: { type: 'number', default: 0 },
  },
} as const;

export type ShortLinkMeta = Meta & FromSchema<typeof shortLinkSchema>;
export type CreateShortLinkMeta = Omit<
  ShortLinkMeta,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>;
