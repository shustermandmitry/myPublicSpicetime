import { Meta } from '@treenity/core';
import type { FromSchema } from 'json-schema-to-ts';

export const reviewsSchema = {
  $id: 'reviews',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'item_id', 'user_id', 'author_id', 'content', 'rating'],
  properties: {
    id: {
      type: 'integer',
    },
    created_at: {
      type: 'string',
      format: 'date',
    },
    updated_at: {
      type: 'string',
      format: 'date',
    },
    deleted_at: {
      type: 'string',
      format: 'date',
    },
    item_id: {
      type: 'integer',
    },
    user_id: {
      type: 'integer',
    },
    author_id: {
      type: 'integer',
    },
    content: {
      type: 'string',
    },
    rating: {
      type: 'number',
      minimum: 0,
      maximum: 5,
      default: 0,
    },
    meta: {
      type: 'object',
      default: {},
    },
  },
} as const;

export type ReviewsMeta = FromSchema<typeof reviewsSchema>;
export type CreateReviewMeta = Omit<ReviewsMeta, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export const reviewsServiceSchema = {
  $id: 'reviews_service',
  type: 'object',
  additionalProperties: false,
  required: ['changeExpired'],
  properties: {
    changeExpired: {
      type: 'number',
    },
    minRating: {
      type: 'number',
    },
    maxRating: {
      type: 'number',
    },
    canCreateMoreReview: {
      type: 'boolean',
    },
    maxLimit: {
      type: 'integer',
    },
    minLimit: {
      type: 'integer',
    },
  },
} as const;

export type ReviewsServiceMeta = Meta & FromSchema<typeof reviewsServiceSchema>;

export const reviewsStatsSchema = {
  $id: 'reviews_stats',
  type: 'object',
  additionalProperties: false,
  required: ['user_id', 'count', 'sum_rating'],
  properties: {
    id: {
      type: 'integer',
    },
    created_at: {
      type: 'string',
      format: 'date',
    },
    updated_at: {
      type: 'string',
      format: 'date',
    },
    deleted_at: {
      type: 'string',
      format: 'date',
    },
    user_id: {
      type: 'integer',
    },
    count: {
      type: 'integer',
    },
    sum_rating: {
      type: 'number',
      default: 0,
      minimum: 0,
    },
  },
} as const;

export type ReviewsStatsMeta = FromSchema<typeof reviewsStatsSchema>;
