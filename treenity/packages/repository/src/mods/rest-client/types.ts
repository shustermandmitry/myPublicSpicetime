import { Params } from '@treenity/feathers-service';

export interface GoServiceItem<T> {
  item: T;
}

export interface GoServiceList<T> {
  list: T[];
}

export interface GoServicePaginationParams {
  offset?: number;
  limit?: number;
  order?: string;
}

export interface GoServicePaginationResponse {
  offset: number;
  totalCount: number;
  countPerPage: number;
}

export interface GoResponseWithPagination<T> {
  pagination: GoServicePaginationResponse;
  list: T[];
}

export type RestClientService = {
  update<Data = {}, Response = any>(method: string, data: Data, params?: Params): Promise<Response>;
};
