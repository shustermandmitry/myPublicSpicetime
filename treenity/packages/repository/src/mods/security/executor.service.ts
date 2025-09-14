import { FeathersService } from '@/utils/feathers-setup-service';
import awaitService from '@/utils/service-awaiter';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';
import { Params } from '@feathersjs/feathers';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { CreateSecurityExecutorMeta, SecuritySourceMeta } from '@/mods/security/executor.meta';
import { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/headers-params';

class SecurityExecutorService extends FeathersService<SecuritySourceMeta> {
  securityExecutorService: RestClientService = null!;

  async _setup(app: Application, path: string) {
    this.securityExecutorService = await awaitService(app, '/sys/security-rest/executor');
  }

  async create(data: CreateSecurityExecutorMeta, params: Params): Promise<SecuritySourceMeta> {
    return await this.securityExecutorService.update<CreateSecurityExecutorMeta>('set', data, {
      headers: CONTENT_TYPE_APPLICATION_JSON,
    });
  }

  async update(id: string, data: SecuritySourceMeta, params: Params): Promise<SecuritySourceMeta> {
    return await this.securityExecutorService.update<CreateSecurityExecutorMeta>(
      'update',
      { id, ...data },
      { headers: CONTENT_TYPE_APPLICATION_JSON },
    );
  }

  async get(type: string, params: Params): Promise<any> {
    return await this.securityExecutorService.update<{
      type: string;
    }>('get', { type }, { headers: CONTENT_TYPE_APPLICATION_JSON });
  }

  async find(params: Params): Promise<any> {
    return await this.securityExecutorService.update<undefined>('list', undefined, {
      headers: CONTENT_TYPE_APPLICATION_JSON,
    });
  }

  async remove(type: string, params: Params): Promise<any> {
    return await this.securityExecutorService.update<{
      type: string;
    }>('remove', { type }, { headers: CONTENT_TYPE_APPLICATION_JSON });
  }

  async teardown() {
    console.log('teardown');
  }
}

feathersContext.add('sys.security.executor.service', SecurityExecutorService);

export default SecurityExecutorService;
