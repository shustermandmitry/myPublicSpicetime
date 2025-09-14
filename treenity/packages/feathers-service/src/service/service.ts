import type {
  Application,
  ApplicationHookOptions,
  Id,
  NullableId,
  Paginated,
  PaginationParams as FeathersPaginationParams,
  Params as FeathersParams,
  Query,
} from '@feathersjs/feathers';
import { Node } from '@treenity/core';
import { clamp } from '@treenity/js-shared/utils';
import EventEmitter from 'eventemitter3';
import { defaultServiceMethods } from '../feathers';

export interface CliParams {
  paginate?: FeathersPaginationParams;
  cliParams?: any;
  entity?: boolean;
  e?: boolean;
  sub?: boolean;
}

export type Params<T = Query> = FeathersParams<T> & CliParams;

interface IPagination {
  $sort: any;
  $limit: number;
  $skip: number;
}

export interface ServiceConstructorParams<M = any> {
  meta: M;
  node: Node;
  app?: Application;
}

export interface AuthParams<Q = Query, User = any> extends Params<Q> {
  user: User;
  role: string;
  user_id: number;
}

export interface PaginationParamsS<Q = Query> extends Omit<Params<Q>, 'paginate'> {
  paginate?: FeathersPaginationParams;
}

export interface RequestParams<Q = Query, User = any>
  extends PaginationParamsS<Q>,
    AuthParams<Q, User> {}

export interface TreenityBaseMethods<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
  FindResult = Result[],
> {
  get(id: Id, params?: ServiceParams): Promise<Result>;
  create(data: Data, params?: ServiceParams): Promise<Result>;
  update(id: NullableId, data: Data, params?: ServiceParams): Promise<Result>;
  find(params?: ServiceParams): Promise<FindResult>;
  patch(id: NullableId, data: PatchData, params?: ServiceParams): Promise<Result>;
  remove(id: NullableId, params?: ServiceParams): Promise<Result>;
  setup?(app: Application, path: string): Promise<void>;
  teardown?(app: Application, path: string): Promise<void>;
}

export type TreenityBaseInterface<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
  FindResult = Result[],
> = TreenityBaseMethods<Result, Data, ServiceParams, PatchData, FindResult>;

abstract class TreenityBaseService<
    Result = any,
    Data = Partial<Result>,
    ServiceParams = Params,
    PatchData = Partial<Data>,
    FindResult = Paginated<Result>,
  >
  extends EventEmitter
  implements TreenityBaseInterface<Result, Data, ServiceParams, PatchData, FindResult>
{
  path: string = '';
  customMethods: string[] = [];
  customEvents: string[] = [];
  protected maxLimit: number = 100;
  protected minLimit: number = 10;

  public getPagination = (params: Params): IPagination => {
    const { $limit, $skip, $sort } = params.query || {};
    const limit = clamp($limit || this.minLimit, this.minLimit, this.maxLimit);
    const skip = Math.max($skip || 0, 0);
    return {
      $limit: limit,
      $skip: skip,
      $sort,
    };
  };

  public setup(app: Application, path: string) {
    this.path = path;
    const hooks = this.getHooks();
    if (hooks) {
      // @ts-ignore
      this.hooks(hooks);
    }

    return this._setup(app, path);
  }

  public getCustomMethods(): string[] | undefined {
    return [...defaultServiceMethods, ...this.customMethods];
  }

  public getCustomEvents(): string[] | undefined {
    return [...this.customEvents];
  }

  public getHooks(): ApplicationHookOptions<this> | undefined {
    return;
  }

  protected async _setup(app: Application, path: string): Promise<void> {}

  get(id: Id, params?: ServiceParams): Promise<Result> {
    throw new Error('Not implemented: get');
  }

  find(params?: ServiceParams | undefined): Promise<FindResult> {
    throw new Error('Not implemented: find');
  }

  create(data: Data, params?: ServiceParams): Promise<Result> {
    throw new Error('Not implemented: create');
  }

  update(id: NullableId, data: Data, params?: ServiceParams): Promise<Result> {
    throw new Error('Not implemented: update');
  }

  patch(id: NullableId, data: PatchData, params?: ServiceParams): Promise<Result> {
    throw new Error('Not implemented: patch');
  }

  remove(id: NullableId, params?: ServiceParams): Promise<Result> {
    throw new Error('Not implemented: remove');
  }

  async teardown(app: Application, path: string) {
    console.log(`Teardown ${path}`);
  }
}

export interface TreenityInterface<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
  FindResult = Result[],
> extends TreenityBaseInterface<Result, Data, ServiceParams, PatchData, FindResult> {
  find(params?: ServiceParams): Promise<FindResult>;
}

export abstract class TreenityService<
    Result = any,
    Data = Partial<Result>,
    ServiceParams = Params,
    PatchData = Partial<Data>,
    FindResult = Result[],
  >
  extends TreenityBaseService<Result, Data, ServiceParams, PatchData, FindResult>
  implements TreenityInterface<Result, Data, ServiceParams, PatchData, FindResult>
{
  find(params?: ServiceParams): Promise<FindResult> {
    throw new Error('Not implemented');
  }
}

export interface TreenityPaginationInterface<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params & PaginationParamsS,
  PatchData = Partial<Data>,
  FindResult = Paginated<Result>,
> extends TreenityBaseInterface<Result, Data, ServiceParams, PatchData, FindResult> {
  find(params?: ServiceParams): Promise<FindResult>;
}

export abstract class TreenityPaginationService<
    Result = any,
    Data = Partial<Result>,
    ServiceParams = Params & PaginationParamsS,
    PatchData = Partial<Data>,
    FindResult = Paginated<Result>,
  >
  extends TreenityBaseService<Result, Data, ServiceParams, PatchData, FindResult>
  implements TreenityPaginationInterface<Result, Data, ServiceParams, PatchData, FindResult>
{
  find(params?: ServiceParams): Promise<FindResult> {
    throw new Error('Not implemented');
  }
}
