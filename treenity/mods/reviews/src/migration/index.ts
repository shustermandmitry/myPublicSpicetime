import { ReviewsInit } from './00001-reviews-init';
import { ReviewsStatsInit } from './00001-reviews-stats-init';

export const reviewsMigrations = ['reviews.migration', [ReviewsInit]];
export const reviewsStatsMigrations = ['reviews_stats.migration', [ReviewsStatsInit]];
