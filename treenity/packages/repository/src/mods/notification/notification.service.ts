import { Application } from '@/declarations';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { GoServiceItem, GoServiceList, GoServicePaginationParams } from '@/mods/rest-client/types';
import { awaitService, feathersContext, Params, TreenityService } from '@treenity/feathers-service';
import {
  CountResponse,
  FindParams,
  ICreateNotification,
  INotification,
  UserIdParams,
} from './notification.meta';
import { APPLICATION_JSON_HEADER } from '@/mods/notification/consts';

class NotificationService extends TreenityService<INotification> {
  private notificationService: RestClientService = null!;
  customMethods: string[] = ['unreadCount', 'readOne', 'readAll'];

  async _setup(app: Application, path: string) {
    this.notificationService = await awaitService(app, '/sys/notification-rest');
  }

  async find(params: Params<FindParams>): Promise<INotification[]> {
    const { userId, query, opts } = params.query!;
    // @ts-ignore
    const { list, pagination } = await this.notificationService.update<
      FindParams,
      GoServiceList<INotification>
    >(
      'list',
      {
        userId: Number(userId),
        query,
        opts,
      },
      { headers: APPLICATION_JSON_HEADER },
    );

    // @ts-ignore
    return { list, pagination };
  }

  async get(id: number, params: Params<FindParams>): Promise<INotification> {
    const { userId, query } = params.query!;
    const value = query ? query : `user_id=${userId}`;
    const { item } = await this.notificationService.update<
      Pick<FindParams, 'query'>,
      GoServiceItem<INotification>
    >('get', { query: value }, { headers: APPLICATION_JSON_HEADER });

    return item;
  }

  async create(data: ICreateNotification, params: Params) {
    const res = await this.notificationService.update<ICreateNotification, never>('create', data, {
      headers: APPLICATION_JSON_HEADER,
    });
    return res;
  }

  async readOne(data: { id: number }, params: Params) {
    const { id } = data;
    return await this.notificationService.update<
      {
        id: number;
      },
      never
    >('read-one', { id }, { headers: APPLICATION_JSON_HEADER });
  }

  async readAll(data: UserIdParams, params: Params) {
    const { userId } = data;
    return this.notificationService.update<{ userId: number }, never>(
      'read-all',
      { userId },
      { headers: APPLICATION_JSON_HEADER },
    );
  }

  async unreadCount(data: UserIdParams, params: Params) {
    const { userId } = data;
    return await this.notificationService.update<{ userId: number }, CountResponse>(
      'unread-count',
      { userId },
      { headers: APPLICATION_JSON_HEADER },
    );
  }
}

feathersContext.add('sys.notification.uc', NotificationService);

export default NotificationService;
