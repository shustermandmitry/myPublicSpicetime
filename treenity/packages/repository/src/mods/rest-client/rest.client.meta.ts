import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const restClientSchema = {
  $id: 'http_client',
  type: 'object',
  additionalProperties: false,
  required: ['connection'],
  properties: {
    connection: {
      type: 'object',
      required: ['host', 'port', 'protocol'],
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        protocol: { type: 'string' },
      },
    },
    methods: {
      type: 'object',
    },
  },
} as const;

export type RestClientSchema = Meta & FromSchema<typeof restClientSchema>;
