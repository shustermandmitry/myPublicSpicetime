import RedisAdapter, { RedisServiceOptions } from '@/mods/redis/redis.adapter';
import { RedisServiceMeta, redisServiceSchema } from '@/mods/redis/redis.meta';
import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Node, types } from '@treenity/core';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { SetOptions } from 'redis';

class RedisService<
  Data = any,
  PatchData = Partial<Data>,
  Options extends RedisServiceOptions = RedisServiceOptions,
> extends RedisAdapter {
  meta: RedisServiceMeta = null!;
  node: Node;

  constructor({ node, meta }: ServiceConstructorParams<RedisServiceMeta>) {
    // @ts-ignore
    super(meta.options);
    this.meta = meta;
    this.node = node;
  }

  async find(params?: Params): Promise<Paginated<Data> | Data[]> {
    return this._find(params);
  }

  async get(id: Id, params?: Params<SetOptions>): Promise<Data> {
    return this._get(id, params);
  }

  async create(
    data: Partial<PatchData> | Partial<PatchData>[],
    params?: Params<SetOptions>,
  ): Promise<Data | Data[]> {
    return this._create(data, params);
  }

  async update(id: Id, data: Partial<Data>, params?: Params<SetOptions>): Promise<Data> {
    return this._update(id, data, params);
  }

  async patch(
    id: NullableId,
    data: Partial<PatchData>,
    params?: Params<SetOptions>,
  ): Promise<Data | Data[]> {
    return this._patch(id as any, data, params);
  }

  async remove(id: NullableId, params?: Params): Promise<Data | Data[]> {
    return this._remove(id as any, params);
  }
}

types.schema.add('db.redis-model', redisServiceSchema, {});
feathersContext.add('sys.redis', RedisService);

export default RedisService;
