import { Application } from '@/declarations';
import { AggregationServiceMeta } from '@/mods/aggregation/aggregation.meta';
import { feathersContext } from '@treenity/feathers-service';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { FeathersService } from '@/utils/feathers-setup-service';
import awaitService from '@/utils/service-awaiter';
import { Id, Params, ServiceMethods } from '@feathersjs/feathers';
import { clone } from '@s-libs/micro-dash';

interface IForeign {
  link: string;
  type?: string;
  primaryKey: string;
  foreignKey?: string;
  field?: string;
}

export type WithField<T, FT, F extends string> = T & { [key in F]: FT };

export class AggregationService<T, A, F extends string> extends FeathersService<
  WithField<T, A[], F>
> {
  meta: AggregationServiceMeta = null!;
  foreignService: Map<string, ServiceMethods<A>> = new Map<string, ServiceMethods<A>>();
  primaryService: ServiceMethods<T> = null!;
  app: Application = null!;

  constructor({ meta, app }: ServiceConstructorParams<AggregationServiceMeta>) {
    super();
    this.meta = meta;
    this.app = app!;
  }

  async _setup(app: Application, path: string) {
    this.primaryService = await awaitService(app, this.meta.primary);
    for (const foreignMeta of this.meta.foreign!) {
      this.foreignService.set(foreignMeta.link, await awaitService(app, foreignMeta.link));
    }
  }

  private async hasOne(nodes: any, foreignMeta: IForeign, params: Params) {
    const ids = nodes.map((node: any) => node[foreignMeta.primaryKey]).filter((i: any) => !!i);
    if (ids.length === 0) {
      return nodes;
    }
    const foreignService = this.foreignService.get(foreignMeta.link);
    if (!foreignService) {
      return nodes;
    }

    const foreignKey = foreignMeta.foreignKey || 'id';
    const items = await foreignService.find({
      query: { [foreignKey]: { $in: ids } },
      provider: params.provider,
    });
    nodes.forEach((node: any) => {
      let item = null;
      const isArray = Array.isArray(items);
      if (isArray && items.length) {
        item = items.find((item: any) => item[foreignKey] === node[foreignMeta.primaryKey]);
      } else if (!isArray) {
        item = items;
      }

      node[foreignMeta.field as string] = item;
    });
    return nodes;
  }

  private async hasMany(nodes: any, foreignMeta: IForeign, params: Params) {
    const ids = nodes.map((node: any) => node.id);
    if (ids.length === 0) {
      return nodes;
    }
    const foreignService = this.foreignService.get(foreignMeta.link);
    if (!foreignService) {
      return nodes;
    }
    const items = (await foreignService.find({
      query: { [foreignMeta.primaryKey]: { $in: ids } },
      provider: params.provider,
    })) as A[];
    nodes.forEach((node: any, index: number) => {
      node[foreignMeta.field as string] = items.filter(
        (item: any) => item[foreignMeta.primaryKey] === node.id,
      );
    });
    return nodes;
  }

  private async getAggregationsArray(_nodes: T[], params: Params) {
    type Result = WithField<T, A[], F>;

    let nodes = clone(_nodes);
    for (const foreignMeta of this.meta.foreign!) {
      const isHasMany = foreignMeta.type === 'hasMany';
      nodes = isHasMany
        ? await this.hasMany(nodes, foreignMeta, params)
        : await this.hasOne(nodes, foreignMeta, params);
    }
    return nodes as Result[];
  }

  private async getAggregationsSingle(_node: T, params: Params) {
    type Result = WithField<T, A[], F>;

    let node = clone(_node);
    for (const foreignMeta of this.meta.foreign!) {
      const isHasMany = foreignMeta.type === 'hasMany';
      let [updatedNode] = isHasMany
        ? await this.hasMany([node], foreignMeta, params)
        : await this.hasOne([node], foreignMeta, params);
      node = updatedNode;
    }
    return node as Result;
  }

  async find(params: Params): Promise<any> {
    const nodes = (await this.primaryService.find(params)) as T[];
    return this.getAggregationsArray(nodes, params);
  }

  async get(id: Id, params: Params) {
    type Result = WithField<T, A[], F>;

    const node = (await this.primaryService.get(id, params)) as T;
    return this.getAggregationsSingle(node, params);
  }

  private async changeForeign(data: any) {
    if (!data) {
      return;
    }

    for (const foreignMeta of this.meta.foreign!) {
      if (!foreignMeta.passThrough) {
        continue;
      }

      const values = data[foreignMeta.field!];
      if (!values) {
        continue;
      }

      const foreignService = this.foreignService.get(foreignMeta.link);
      if (!foreignService) {
        continue;
      }

      const foreignKey = foreignMeta.foreignKey || 'id';
      const query = { [foreignKey]: data[foreignMeta.primaryKey] };

      let foreignItem: any;
      try {
        // @ts-ignore
        foreignItem = await foreignService.get(null, { query });
      } catch (e) {}

      if (!foreignItem) {
        await foreignService.create({ ...values, ...query });
      } else {
        await foreignService.update(foreignItem.id, values, { query });
      }
    }
  }

  async create(data: any, params: Params) {
    await this.changeForeign(data);
    const value = await this.primaryService.create(data, params);
    return this.getAggregationsSingle(value, params);
  }

  async update(id: Id, data: any, params: Params) {
    await this.changeForeign(data);
    const value = (await this.primaryService.update(id, data, params)) as T;
    return this.getAggregationsSingle(value, params);
  }

  async patch(id: Id, data: any, params: Params) {
    await this.changeForeign(data);
    const value = (await this.primaryService.patch(id, data, params)) as T;
    return this.getAggregationsSingle(value, params);
  }

  async remove(id: Id, params: Params) {
    const value = (await this.primaryService.remove(id, params)) as T;
    return this.getAggregationsSingle(value, params);
  }

  async teardown() {
    console.log('teardown');
  }
}

feathersContext.add('sys.aggregation', AggregationService);

export default AggregationService;
