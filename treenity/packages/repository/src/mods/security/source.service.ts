import { FeathersService } from '@/utils/feathers-setup-service';
import awaitService from '@/utils/service-awaiter';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';
import { Params } from '@feathersjs/feathers';
import RestClientService from '@/mods/rest-client/rest.client.service';
import { SecuritySourceMeta } from '@/mods/security/executor.meta';

class SecuritySourceService extends FeathersService<SecuritySourceMeta> {
  securitySourceService: RestClientService = null!;

  async _setup(app: Application, path: string) {
    this.securitySourceService = await awaitService(app, '/sys/security-rest/source');
  }

  async create(data: SecuritySourceMeta, params: Params): Promise<SecuritySourceMeta> {
    return await this.securitySourceService.update<SecuritySourceMeta>('set', data, params);
  }

  async get(type: string, params: Params): Promise<SecuritySourceMeta> {
    return await this.securitySourceService.update<{ type: string }>('get', { type }, params);
  }

  async teardown() {
    console.log('teardown');
  }
}

feathersContext.add('sys.security.source.service', SecuritySourceService);

export default SecuritySourceService;
