import { FeathersService } from '@/utils/feathers-setup-service';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';
import { Params } from '@feathersjs/feathers';
import RestClientService from '@/mods/rest-client/rest.client.service';
import {
  CreateSecurityMeta,
  GetByCodeRequest,
  SecurityCodeMeta,
} from '@/mods/security/security-code.meta';
import { Unprocessable } from '@feathersjs/errors';
import { awaitService } from '@/utils';
import { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/headers-params';

export interface VerifyRequest {
  itemId: string;
  type: string;
  code: string;
}

export type SecurityResponse = { item: SecurityCodeMeta };

class SecurityService extends FeathersService<SecurityCodeMeta | null> {
  securityService: RestClientService = null!;
  customMethods: string[] = ['verify', 'getByCode'];

  async _setup(app: Application, path: string) {
    this.securityService = await awaitService(app, '/sys/security-rest');
  }

  async create(data: CreateSecurityMeta, params: Params): Promise<SecurityCodeMeta> {
    const { item } = await this.securityService.update<CreateSecurityMeta, SecurityResponse>(
      'create',
      data,
      { headers: CONTENT_TYPE_APPLICATION_JSON },
    );
    return item;
  }

  async verify(data: VerifyRequest, params: Params): Promise<null> {
    const { type, itemId, code } = data;
    const { item } = await this.securityService.update<VerifyRequest, { item: null }>(
      'verify',
      { type, itemId, code },
      { headers: CONTENT_TYPE_APPLICATION_JSON },
    );

    return item;
  }

  async getByCode({ code, type }: GetByCodeRequest, params: Params): Promise<SecurityCodeMeta> {
    if (!code) {
      throw new Unprocessable('Invalid code');
    }
    const { item } = await this.securityService.update<GetByCodeRequest, SecurityResponse>(
      'getByCode',
      { type, code },
      { headers: CONTENT_TYPE_APPLICATION_JSON },
    );
    return item;
  }

  async teardown() {
    console.log('teardown');
  }
}

feathersContext.add('sys.security.service', SecurityService);

export default SecurityService;
