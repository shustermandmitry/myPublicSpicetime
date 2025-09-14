import { Application } from '@/declarations';
import { ICreateNotificationTemplate, INotificationTemplate } from './template.meta';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { feathersContext } from '@treenity/feathers-service';
import { awaitService, Params, TreenityService } from '@treenity/feathers-service';
import { GoServiceItem, GoServiceList, GoServicePaginationParams } from '@/mods/rest-client/types';

class NotificationTemplateUC extends TreenityService<INotificationTemplate> {
  private notificationTemplateService: RestClientService = null!;
  customMethods: string[] = ['send', 'count'];

  async _setup(app: Application, path: string) {
    this.notificationTemplateService = await awaitService(app, '/sys/notification-rest/template');
  }

  async send(data: any, params: Params = {}): Promise<never> {
    return await this.notificationTemplateService.update('send', data, params);
  }

  async create(data: ICreateNotificationTemplate, params: Params) {
    const { item } = await this.notificationTemplateService.update<
      ICreateNotificationTemplate,
      GoServiceItem<INotificationTemplate>
    >('create', data, params);
    return item;
  }

  async update(id: string, data: INotificationTemplate, params: Params) {
    const { item } = await this.notificationTemplateService.update<
      INotificationTemplate,
      GoServiceItem<INotificationTemplate>
    >('update', { ...data, id: parseInt(id) }, params);

    return item;
  }

  private getQuery(params: Params) {
    const { $skip, $sort, $limit, $select, ...query } = params.query || {};

    return {
      query,
      filters: { $skip, $sort, $limit, $select },
    };
  }

  async find(params: Params) {
    const { filters } = this.getQuery(params);
    const { list } = await this.notificationTemplateService.update<
      GoServicePaginationParams,
      GoServiceList<INotificationTemplate>
    >(
      'list',
      {
        order: filters.$sort,
        offset: parseInt(filters.$skip),
        limit: parseInt(filters.$limit),
      },
      params,
    );

    return list;
  }

  async get(slug: string, params: Params) {
    const { item } = await this.notificationTemplateService.update<
      { slug: string },
      GoServiceItem<INotificationTemplate>
    >('get-template', { slug }, params);
    return item;
  }

  async remove(id: string, params: Params) {
    return this.notificationTemplateService.update('remove', { id }, params);
  }

  async count(data: any, params: Params): Promise<number> {
    const { item } = await this.notificationTemplateService.update<
      undefined,
      GoServiceItem<number>
    >('count', undefined, params);

    return item;
  }
}

feathersContext.add('sys.notification.template.uc', NotificationTemplateUC);

export default NotificationTemplateUC;
