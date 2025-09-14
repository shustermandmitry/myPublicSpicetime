import {
  AdapterBase,
  AdapterParams,
  AdapterServiceOptions,
  PaginationOptions,
} from '@feathersjs/adapter-commons';
import { Conflict, Unprocessable } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { get, merge } from '@s-libs/micro-dash';
import { createClient, RedisClientOptions, RedisClientType } from 'redis';

export interface RedisServiceOptions extends RedisClientOptions, AdapterServiceOptions {
  dataKey: string;
}

class RedisAdapter<
  Result extends { data: string } = any,
  Data = Partial<Result>,
  PatchData = Partial<Data>,
  ServiceParams extends Params = Params,
  Options extends RedisServiceOptions = RedisServiceOptions,
> extends AdapterBase<Result, Data, PatchData, ServiceParams, Options> {
  declare options: Options;

  client!: RedisClientType;
  private reconnectAttempts: number = 0;
  private isConnecting: boolean = false;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 5000;

  private createRedisClient(options: Options) {
    const client = createClient(options);

    client.on('error', async err => {
      console.error('Redis Client Error:', err);
      if (!this.isConnecting) {
        await this.handleReconnect();
      }
    });

    client.on('connect', () => {
      console.info('Redis connect');
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    });

    return client;
  }

  private async handleReconnect(): Promise<void> {
    if (this.isConnecting) return;
    this.isConnecting = true;

    while (this.reconnectAttempts < this.maxReconnectAttempts!) {
      try {
        if (!this.client.isOpen) {
          await this.client.connect();
          return;
        }
        return;
      } catch (error) {
        console.error(`Reconnection attempt ${this.reconnectAttempts + 1} failed:`, error);
        this.reconnectAttempts++;

        if (this.reconnectAttempts < this.maxReconnectAttempts!) {
          await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));
        }
      }
    }

    console.error('Max reconnection attempts reached. Giving up.');
    this.isConnecting = false;
  }

  constructor(options: Options) {
    super(options);
    this.client = this.createRedisClient(options) as RedisClientType;
  }

  async setup() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Initial connection failed:', error);
      await this.handleReconnect();
    }
  }

  async getKeys(pattern: string, params?: AdapterParams) {
    return await this.client.keys(pattern);
  }

  async _find(
    params?: ServiceParams & { paginate?: PaginationOptions },
  ): Promise<Paginated<Result>>;
  async _find(params?: ServiceParams & { paginate: false }): Promise<Result[]>;
  async _find(params: ServiceParams = {} as ServiceParams): Promise<Paginated<Result> | Result[]> {
    const { query } = params;
    if (!query) {
      throw new Unprocessable('query is required');
    }

    const { pattern } = query;

    const keys = await this.getKeys(pattern);
    const result: Result[] = [];

    for (const key of keys) {
      const value = await this._get(key);
      result.push(value);
    }

    return result;
  }

  async _get(id: Id, params?: ServiceParams): Promise<Result> {
    let data = await this.client.get(id as string);
    try {
      data = JSON.parse(data as string);
    } catch (e) {}
    return { [this.id]: id, data } as Result;
  }

  async _create(data: Data, params?: ServiceParams): Promise<Result>;
  async _create(data: Data[], params?: ServiceParams): Promise<Result[]>;
  async _create(data: Data | Data[], _params?: ServiceParams): Promise<Result | Result[]>;
  async _create(
    data: Data | Data[],
    params: ServiceParams = {} as ServiceParams,
  ): Promise<Result | Result[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(item => this._create(item, params)));
    }

    const key = get(data as Record<string, any>, this.id, undefined);
    if (!key) {
      throw new Conflict(`Redis key is required in ${this.id} in filed}`);
    }

    const value = get(data as Record<string, any>, 'data', undefined);
    if (!value) {
      throw new Unprocessable('Redis data is required');
    }

    if ((await this._get(key, params))?.data) {
      throw new Conflict(`Redis value with key ${key} already exists`);
    }

    await this._set(key, value, params);
    return this._get(key, params);
  }

  async _set(key: Id, value: any, params?: ServiceParams) {
    if (!key) {
      throw new Unprocessable(`Redis ${this.id} is required`);
    }

    const { query } = params || {};

    const _value = typeof value !== 'string' ? JSON.stringify(value) : value;
    await this.client.set(key as string, _value, query);
  }

  async _update(id: Id, data: Data, params?: ServiceParams): Promise<Result> {
    await this._set(id, data, params);
    return this._get(id, params);
  }

  async _remove(id: null, params?: ServiceParams): Promise<Result[]>;
  async _remove(id: Id, params: ServiceParams): Promise<Result>;
  async _remove(id: NullableId, params?: ServiceParams): Promise<Result | Result[]> {
    if (!id) {
      throw new Unprocessable('id is required');
    }

    const entry = await this._get(id as Id, params);
    if (!entry) {
      throw new Unprocessable('Entry not found');
    }

    await this.client.del(id as string);

    return entry;
  }

  async _patch(id: null, data: PatchData, params?: ServiceParams): Promise<Result[]>;
  async _patch(id: Id, data: PatchData, params?: ServiceParams): Promise<Result>;
  async _patch(id: Id | null, data: PatchData, params?: ServiceParams): Promise<Result | Result[]>;
  async _patch(
    id: NullableId,
    data: PatchData,
    params?: ServiceParams,
  ): Promise<Result | Result[]> {
    if (!id) {
      throw new Unprocessable('id is req');
    }
    const old_data = await this._get(id as string, params);
    if (!old_data) {
      throw new Unprocessable('old_data not found');
    }
    // @ts-ignore
    const new_data = merge(old_data as any, data);
    await this._set(id as Id, new_data, params);
    return new_data;
  }
}

export default RedisAdapter;
