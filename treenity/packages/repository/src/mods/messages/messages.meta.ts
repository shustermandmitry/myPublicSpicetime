import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const messagesServiceSchema = {
  $id: 'test.messages',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {},
} as const;
export type MessagesServiceMeta = Meta & FromSchema<typeof messagesServiceSchema>;
