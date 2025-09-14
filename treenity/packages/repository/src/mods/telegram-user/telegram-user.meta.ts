import { FromSchema } from '@treenity/json-schema';

export const telegramUserCreatedSchema = {
  $id: 'telegram-user_create',
  type: 'object',
  additionalProperties: false,
  required: ['chat_instance', 'user_id', 'tuser'],
  properties: {
    chat_instance: { type: 'string' },
    tuser: { type: 'integer' },
    user_id: { type: 'integer' },
    user_name: { type: 'string' },
    is_premium: { type: 'boolean' },
  },
} as const;

export type ITelegramUserCreate = FromSchema<typeof telegramUserCreatedSchema>;
