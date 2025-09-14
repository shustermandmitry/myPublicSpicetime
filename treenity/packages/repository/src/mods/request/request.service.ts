import { FeathersService } from '@/utils/feathers-setup-service';
import awaitService from '@/utils/service-awaiter';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';
import { Params } from '@feathersjs/feathers';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { ChangeStatusRequest, CreateRequestMeta, IRequest } from './request.meta';
import { GoServiceItem, GoServiceList } from '@/mods/rest-client/types';
import { IdRequest } from '@/utils/base-types';

class RequestService extends FeathersService<IRequest> {
  customMethod: string[] = ['changeStatus'];
  requestService: RestClientService = null!;

  async _setup(app: Application, path: string) {
    this.requestService = await awaitService(app, '/sys/request-rest');
  }

  async create(data: CreateRequestMeta, params: Params): Promise<IRequest> {
    const { item } = await this.requestService.update<CreateRequestMeta, GoServiceItem<IRequest>>(
      'create',
      data,
      params,
    );
    return item;
  }

  async update(id: number, data: CreateRequestMeta, params: Params): Promise<IRequest> {
    const { item } = await this.requestService.update<IRequest, GoServiceItem<IRequest>>(
      'update',
      { ...data, id },
      params,
    );
    return item;
  }

  async find(params: Params<any>): Promise<IRequest[]> {
    const { $limit, $skip, $sort } = params.query;
    const opts = {
      limit: parseInt($limit, 10),
      offset: parseInt($skip, 10),
      order: $sort,
    };
    const { list } = await this.requestService.update<
      {
        opts: object;
      },
      GoServiceList<IRequest>
    >('list', { opts }, params);
    return list;
  }

  async get(id: number, params: Params): Promise<IRequest> {
    const { item } = await this.requestService.update<IdRequest, GoServiceItem<IRequest>>(
      'getById',
      { id },
      params,
    );
    return item;
  }

  async remove(id: string, params: Params): Promise<IRequest> {
    const { item } = await this.requestService.update<IdRequest, GoServiceItem<IRequest>>(
      'remove',
      { id: parseInt(id, 10) },
      params,
    );
    return item;
  }

  async changeStatus(data: ChangeStatusRequest, params: Params): Promise<IRequest> {
    const { id, status } = data;
    const { item } = await this.requestService.update<ChangeStatusRequest, GoServiceItem<IRequest>>(
      'changeStatus',
      { id, status },
      params,
    );

    return item;
  }
}

feathersContext.add('sys.request.service', RequestService);

export default RequestService;
