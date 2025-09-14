import { Meta } from '@treenity/core';
import { FromSchema } from '@treenity/feathers-service';

export const sequelizeServiceSchema = {
  $id: 'sys.sequelize.psql',
  type: 'object',
  additionalProperties: false,
  required: ['client', 'connection'],
  properties: {
    client: { type: 'string' },
    connection: {
      type: 'object',
      additionalProperties: false,
      required: ['host', 'port', 'username', 'database', 'password'],
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        username: { type: 'string' },
        database: { type: 'string' },
        password: { type: 'string' },
        dialect: { type: 'string' },
      },
    },
  },
} as const;

export type SequelizeServiceMeta = Meta & FromSchema<typeof sequelizeServiceSchema>;
