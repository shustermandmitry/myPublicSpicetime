import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const redisServiceSchema = {
  $id: 'sys.redis',
  type: 'object',
  additionalProperties: false,
  required: ['options'],
  properties: {
    options: {
      type: 'object',
      additionalProperties: false,
      required: ['url', 'database'],
      properties: {
        url: { type: 'string' },
        database: { type: 'number' },
      },
    },
  },
} as const;
export type RedisServiceMeta = Meta & FromSchema<typeof redisServiceSchema>;
