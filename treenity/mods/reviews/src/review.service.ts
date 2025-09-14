import {
  Application,
  awaitService,
  Id,
  Paginated,
  Params,
  ServiceConstructorParams,
  TreenityPaginationService,
  Unprocessable,
} from '@treenity/feathers-service';
import { clamp } from '@treenity/js-shared/utils';
import { CreateReviewMeta, ReviewsMeta, ReviewsServiceMeta, ReviewsStatsMeta } from './review.meta';

export type RemoveRequest = { id: number; author_id: number };
export type AverageRequest = { user_id: number };
export type AverageResponse = { count: number; average: number };
export type UpdateRequestParams = { id: number };
export type GeneraCount = { count: number };

export class ReviewsUC extends TreenityPaginationService<ReviewsMeta> {
  private reviewsService: TreenityPaginationService<ReviewsMeta> = null!;
  private reviewsStatsService: TreenityPaginationService<ReviewsStatsMeta> = null!;
  private changeExpired: number = 86400;
  private minRating: number = 0;
  private maxRating: number = 5;
  private _canCreateMoreReview: boolean = true;
  public customMethods: string[] = ['averageRating', 'generalCount'];

  constructor({ meta }: ServiceConstructorParams<ReviewsServiceMeta>) {
    super();
    this.changeExpired = meta.changeExpired ?? this.changeExpired;
    this.minRating = meta.minRating ?? this.minRating;
    this.maxRating = meta.maxRating ?? this.maxRating;
    this._canCreateMoreReview = meta.canCreateMoreReview ?? this._canCreateMoreReview;
    this.maxLimit = meta.maxLimit ?? this.maxLimit;
    this.minLimit = meta.minLimit ?? this.minLimit;
  }

  async _setup(app: Application, path: string) {
    this.reviewsService = await awaitService<TreenityPaginationService<ReviewsMeta>>(
      app,
      '/sys/reviews',
    );
    this.reviewsStatsService = await awaitService<TreenityPaginationService<ReviewsStatsMeta>>(
      app,
      '/sys/reviews-stats',
    );

    this.on('created', (review: ReviewsMeta) => this.createStats(review));
    this.on('removed', (review: ReviewsMeta) => this.removeStats(review));
  }

  private async removeStats(review: ReviewsMeta) {
    const stats = await this.reviewsStatsService.get(null!, {
      query: { user_id: review.user_id },
    });

    Object.assign(stats, {
      count: stats.count - 1,
      sum_rating: stats.sum_rating - review.rating,
    });
    await this.reviewsStatsService.update(stats.id!, stats);
  }

  private async createStats(review: ReviewsMeta) {
    try {
      const stats = await this.reviewsStatsService.get(null!, {
        query: { user_id: review.user_id },
      });

      Object.assign(stats, {
        count: stats.count + 1,
        sum_rating: stats.sum_rating + review.rating,
      });
      await this.reviewsStatsService.update(stats.id!, stats);
    } catch (e) {
      return await this.reviewsStatsService.create({
        user_id: review.user_id,
        count: 1,
        sum_rating: review.rating,
      });
    }
  }

  private async updateStats(review: ReviewsMeta, oldReview: ReviewsMeta) {
    const stats = await this.reviewsStatsService.get(null!, {
      query: { user_id: review.user_id },
    });

    const sum_rating = stats.sum_rating - oldReview.rating + review.rating;
    Object.assign(stats, {
      sum_rating,
    });
    await this.reviewsStatsService.update(stats.id!, stats);
  }

  private getActualRating(rating: number) {
    return clamp(rating, this.minRating, this.maxRating);
  }

  private checkRating(data: CreateReviewMeta) {
    if (typeof data.rating !== 'undefined') {
      data.rating = this.getActualRating(data.rating);
    }
  }

  private async canCreateMoreReview({ item_id, author_id }: CreateReviewMeta) {
    if (!this._canCreateMoreReview) {
      const { total } = await this.reviewsService.find({
        paginate: { default: 1, max: 0 },
        query: {
          item_id,
          author_id,
        },
      });

      if (total > 0) {
        throw new Unprocessable('Can not add more review');
      }
    }
  }

  async get(_: Id, params: Params) {
    const { id } = params.query!;
    return this.reviewsService.get(id);
  }

  async find(params: Params): Promise<Paginated<ReviewsMeta>> {
    const { id } = params.query!;
    if (id) {
      const review = await this.get(null!, params);
      return {
        total: 1,
        limit: 1,
        skip: 0,
        data: [review],
      };
    }

    const paginate = this.getPagination(params);
    return this.reviewsService.find({
      paginate: { default: this.minLimit, max: this.maxLimit },
      ...params,
      query: {
        ...params.query,
        ...paginate,
      },
    });
  }

  async generalCount(value: AverageRequest, params: Params): Promise<GeneraCount> {
    const { total } = await this.reviewsService.find({
      paginate: { default: this.minLimit, max: this.maxLimit },
      query: {
        ...value,
      },
    });

    return { count: total };
  }

  async create(data: CreateReviewMeta, params?: Params) {
    if (data.user_id === data.author_id) {
      throw new Error('You can not review yourself');
    }

    await this.canCreateMoreReview(data);
    this.checkRating(data);

    return this.reviewsService.create(data, params);
  }

  async update(_: Id, data: ReviewsMeta, params: Params<UpdateRequestParams>) {
    const { id } = params.query!;
    const { author_id } = data;
    const review = await this.reviewsService.get(id);
    const oldReview = Object.assign({}, review);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.author_id !== author_id) {
      throw new Error('Only author can change review');
    }

    const createdAtUnix = new Date(review.created_at!).getTime() / 1000;
    const now = new Date().getTime() / 1000;
    const timeAndDuration = createdAtUnix + this.changeExpired;
    const isTimeChangeExpired = timeAndDuration > now;
    if (!isTimeChangeExpired) {
      throw new Error('Time to change has expired');
    }

    this.checkRating(data);

    Object.assign(review, { content: data.content, rating: data.rating });
    const updatedReview = await this.reviewsService.update(review.id!, review, params);
    this.updateStats(review, oldReview);
    return updatedReview;
  }

  async remove(_: Id, params: Params<RemoveRequest>) {
    const { author_id } = params.query!;
    const review = await this.get(null!, params);
    if (!review) {
      throw new Error('Review not found');
    }
    if (review.author_id !== author_id) {
      throw new Error('Only author can change review');
    }

    return this.reviewsService.remove(review.id!);
  }

  async averageRating(value: AverageRequest, params: Params): Promise<AverageResponse> {
    const { data } = await this.reviewsStatsService.find({
      paginate: { default: 1, max: 1 },
      query: { user_id: value.user_id },
    });

    const defaultResponse = {
      count: 0,
      average: 0,
    };
    const stats = data?.at(0);
    if (!stats) {
      return defaultResponse;
    }

    const { count, sum_rating } = stats;
    const average = parseFloat((sum_rating / count).toFixed(2));
    return {
      count,
      average,
    };
  }
}
