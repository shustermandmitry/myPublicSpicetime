import { types } from '@treenity/core';
import { reviewsSchema, reviewsStatsSchema } from './review.meta';

//TODO: any type
types.schema.add('', 'reviews-model', reviewsSchema as any, {});
types.schema.add('', 'reviews-stats-model', reviewsStatsSchema, {});
