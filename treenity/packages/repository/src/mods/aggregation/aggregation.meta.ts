import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';

export const aggregationSchema = {
  $id: 'aggregator.psql',
  type: 'object',
  additionalProperties: false,
  required: ['primary', 'foreign'],
  properties: {
    primary: { type: 'string' },
    foreign: {
      type: 'array',
      items: {
        type: 'object',
        required: ['link', 'primaryKey'],
        properties: {
          link: { type: 'string' },
          primaryKey: { type: 'string' },
          foreignKey: { type: 'string' },
          field: { type: 'string' },
          type: { type: 'string', enum: ['hasOne', 'hasMany'] },
        },
      },
    },
  },
} as const;

export type AggregationServiceMeta = Meta & FromSchema<typeof aggregationSchema>;
