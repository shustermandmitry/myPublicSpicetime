import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const telegramServiceSchema = {
  $id: 'test.telegram',
  type: 'object',
  additionalProperties: false,
  required: ['token', 'botName'],
  properties: {
    token: { type: 'string' },
    botName: { type: 'string' },
  },
} as const;
export type TelegramServiceMeta = Meta & FromSchema<typeof telegramServiceSchema>;
