import { Meta } from '@treenity/core';
import { FromSchema } from '@treenity/feathers-service';

const tablePsqlMeta = {
  id: 'table-psql-meta',
  type: 'object',
  additionalProperties: false,
  required: ['schema'],
  properties: {
    schema: { type: 'object' },
    uniqueFields: { type: 'array', items: { type: 'string' } },
    indexes: { type: 'array', items: { type: 'object' } },
    filters: { type: 'object' },
    operators: { type: 'array', items: { type: 'string' } },
  },
} as const;

export type TablePsqlMeta = Meta & FromSchema<typeof tablePsqlMeta>;
