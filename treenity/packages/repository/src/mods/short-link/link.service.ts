import { FeathersService } from '@/utils/feathers-setup-service';
import awaitService from '@/utils/service-awaiter';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';
import { Params } from '@feathersjs/feathers';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { CreateShortLinkMeta, ShortLinkMeta } from '@/mods/short-link/link.meta';

class ShortLinkService extends FeathersService<ShortLinkMeta> {
  shortLinkService: RestClientService = null!;

  getCustomMethods(): string[] | undefined {
    return ['create', 'update', 'remove', 'get', 'getByCode', 'find', 'count'];
  }

  async _setup(app: Application, path: string) {
    this.shortLinkService = await awaitService(app, '/sys/short-link-rest');
  }

  async create(data: CreateShortLinkMeta, params: Params): Promise<ShortLinkMeta> {
    return await this.shortLinkService.update<CreateShortLinkMeta>('create', data, params);
  }

  async update(id: string, data: CreateShortLinkMeta, params: Params): Promise<ShortLinkMeta> {
    return await this.shortLinkService.update<ShortLinkMeta>(
      'update',
      { id: parseInt(id), ...data },
      params,
    );
  }

  async remove(id: string, params: Params): Promise<ShortLinkMeta> {
    return await this.shortLinkService.update<{ id: number }>(
      'remove',
      { id: parseInt(id) },
      params,
    );
  }

  async get(id: string, params: Params): Promise<ShortLinkMeta> {
    return await this.shortLinkService.update<{ id: number }>('get', { id: parseInt(id) }, params);
  }

  async getByCode(data: { code: string }, params: Params): Promise<ShortLinkMeta> {
    const { code } = data;
    return await this.shortLinkService.update<{ code: string }>('getByCode', { code }, params);
  }

  async find(params: Params<any>): Promise<ShortLinkMeta[]> {
    const { $skip, $sort, $limit } = params.query;
    let opts;

    if ($skip || $sort || $limit) {
      opts = {
        limit: parseInt($limit, 10),
        offset: $skip,
        order: $sort,
      };
    }

    return await this.shortLinkService.update<{ opts?: object }>('list', { opts }, params);
  }

  async count(data: any, params: Params<any>): Promise<{ item: number }> {
    return await this.shortLinkService.update<undefined>('count', undefined, params);
  }

  async teardown() {
    console.log('teardown');
  }
}

feathersContext.add('sys.short.link.service', ShortLinkService);

export default ShortLinkService;
