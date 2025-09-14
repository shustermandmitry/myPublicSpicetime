import { Application } from '@/declarations';
import { SecurityServiceType } from '@/mods/security/security-code.meta';
import { UserMeta } from '@/mods/user/user.meta';
import { awaitService } from '@/utils';
import {
  AuthenticationBaseStrategy,
  AuthenticationParams,
  AuthenticationRequest,
} from '@feathersjs/authentication';
import { Forbidden, NotAuthenticated } from '@feathersjs/errors';
import { Params, Query } from '@feathersjs/feathers';
import { get, omit } from '@s-libs/micro-dash';
import { feathersContext } from '@treenity/feathers-service';

const DEFAULT_PASSWORD = 'no_set';

interface ICodeStrategyOptions {
  defaultRole: string;
  defaultPassword: string;
  useVerify?: boolean;
  customCode?: string;
  disallowSignup?: boolean;
}

class CodeStrategy extends AuthenticationBaseStrategy {
  defaultRole!: string;
  defaultPassword!: string;
  useVerify: boolean = false;
  customCode?: string;
  disallowSignup?: boolean;

  constructor(options: ICodeStrategyOptions) {
    super();
    this.defaultRole = options.defaultRole ?? this.defaultRole;
    this.defaultPassword = options.defaultPassword ?? this.defaultPassword;
    this.useVerify = options.useVerify ?? this.useVerify;
    this.customCode = options.customCode;
    this.disallowSignup = options.disallowSignup;
  }

  verifyConfiguration() {
    const config = this.configuration;

    ['usernameField', 'codeField', 'authCodeField', 'securityServicePath', 'codeLifetime'].forEach(
      prop => {
        if (typeof config[prop] !== 'string') {
          throw new Error(`'${this.name}' authentication strategy requires a '${prop}' setting`);
        }
      },
    );
  }

  get configuration() {
    const authConfig = this.authentication!.configuration;
    const config = super.configuration || {};
    const node_env = process.env.NODE_ENV;
    return {
      hashSize: 10,
      service: authConfig.service,
      entity: authConfig.entity,
      entityId: authConfig.entityId,
      errorMessage: 'Invalid login',
      isProduction: node_env === 'production',
      codeLifetime: '60', // 60 sec
      authCodeLifetime: '900', //15 min
      ...config,
    };
  }

  async getEntityQuery(query: Query, _params: Params) {
    return {
      $limit: 1,
      ...query,
    };
  }

  async findEntity(username: string, params: Params) {
    const { usernameField, errorMessage } = this.configuration;
    if (!username) {
      throw new NotAuthenticated(errorMessage);
    }

    const query = await this.getEntityQuery(
      {
        [usernameField]: username,
      },
      params,
    );

    const findParams = Object.assign(params, { query });
    const entityService = this.entityService;
    delete findParams['provider'];

    const result = await entityService.find(findParams);
    const [entity = null] = result.data ? result.data : result;

    return entity;
  }

  private getEntityId(result: any) {
    const entityService = this.entityService;
    const { entityId = (entityService as any).id } = this.configuration;
    return result[entityId];
  }

  async getEntity(result: any, params: Params) {
    const entityService = this.entityService;
    const { entityId = (entityService as any).id, entity } = this.configuration;

    if (!entityId || result[entityId] === undefined) {
      throw new NotAuthenticated('Could not get entityId');
    }

    if (!params.provider) {
      return result;
    }

    return entityService.get(result[entityId], {
      ...params,
      [entity]: result,
    });
  }

  async getEntityById(entityId: string, params: Params) {
    if (!entityId) {
      throw new NotAuthenticated('Could not get entityId');
    }
    const entityService = this.entityService;
    return entityService.get(entityId, params);
  }

  async getAuthCode(oldAuthCode: string, user: UserMeta): Promise<string> {
    const { securityServicePath, authCodeLifetime } = this.configuration;
    const securityService = await awaitService(
      this.app as Application,
      securityServicePath,
      SecurityServiceType,
    );

    const id = this.getEntityId(user);
    if (oldAuthCode) {
      const verifyData = await securityService
        .getByCode({
          code: oldAuthCode,
          type: 'registration',
        })
        .catch(() => null);
      if (verifyData?.itemId === String(id)) {
        return verifyData?.code;
      }
    }

    const lifetimeMs = authCodeLifetime && parseInt(authCodeLifetime, 10) * 1000;
    const created = await securityService.create({
      itemId: String(id),
      type: 'registration',
      lifetimeMs,
    });

    return created.code;
  }

  async sendTwoFaCode(authCode: string, result: any) {
    const { securityServicePath, usernameField, codeLifetime } = this.configuration;
    const securityService = await awaitService(
      this.app as Application,
      securityServicePath,
      SecurityServiceType,
    );

    const lifetimeMs = codeLifetime && parseInt(codeLifetime, 10) * 1000;
    const created = await securityService.create({
      itemId: authCode,
      type: 'auth',
      lifetimeMs,
    });

    const email = result[usernameField];
    if (!email) {
      throw new Error('User email not found');
    }

    const auth = this.app!.defaultAuthentication!();
    // @ts-ignore
    auth.emit('onCodeConfirm', {
      email,
      lang: result.lang,
      code: created.code,
    });
  }

  async resendCode(data: AuthenticationRequest, params: AuthenticationParams) {
    const { usernameField } = this.configuration;
    const username = get(data, usernameField);
    const oldAuthCode = get(data, 'authCode');
    const userEntity = await this.findEntity(username, params);
    const authCode = await this.getAuthCode(oldAuthCode, userEntity);
    await this.sendTwoFaCode(authCode, userEntity);
    return { authCode };
  }

  async verifyCode(authCode: string, code: string): Promise<string> {
    const { securityServicePath, isProduction } = this.configuration;
    const securityService = await awaitService(
      this.app as Application,
      securityServicePath,
      SecurityServiceType,
    );

    const authItem = await securityService
      .getByCode({ code: authCode, type: 'registration' })
      .catch(() => null);

    if (!authItem) {
      throw new Error('request.verify.not-found');
    }

    const { itemId } = authItem;

    if (this.customCode) {
      if (code !== this.customCode) {
        throw new Error('request.verify.not-valid');
      }
    } else if (isProduction) {
      try {
        await securityService.verify({
          code,
          itemId: authItem.code,
          type: 'auth',
        });
        await securityService.verify({
          code: authCode,
          itemId,
          type: 'registration',
        });
      } catch (e) {
        throw new Error('request.verify.not-valid');
      }
    }

    return itemId;
  }

  async createEntity(data: { username: string; lang: string }, params: Params) {
    return this.entityService.create(
      {
        email: data.username,
        lang: data.lang,
        role: this.defaultRole,
        password: DEFAULT_PASSWORD,
      },
      omit(params, 'query'),
    );
  }

  async needSendTwoFaCode(oldAuthCode: string) {
    const { securityServicePath, isProduction } = this.configuration;
    const securityService = await awaitService(
      this.app as Application,
      securityServicePath,
      SecurityServiceType,
    );

    const item = await securityService
      .getByCode({ code: oldAuthCode, type: 'auth' })
      .catch(() => undefined);
    return !item;
  }

  async signUp(data: AuthenticationRequest, params: AuthenticationParams) {
    const { usernameField, isProduction, authCodeField } = this.configuration;
    const oldAuthCode = get(data, authCodeField);
    const username = get(data, usernameField);
    const lang = get(data, 'lang');
    const existingEntity = await this.findEntity(username, params);
    if (this.disallowSignup && !existingEntity) {
      throw new Forbidden('Access denied');
    }

    const authEntity = !existingEntity
      ? await this.createEntity({ username, lang }, params)
      : await this.findEntity(username, params);

    const authCode = await this.getAuthCode(oldAuthCode, authEntity);
    const needSend = await this.needSendTwoFaCode(oldAuthCode);
    if (!this.customCode && isProduction && needSend) {
      try {
        await this.sendTwoFaCode(authCode, authEntity);
      } catch (e) {
        console.warn(e);
      }
    }

    const auth = this.app!.defaultAuthentication!();
    // @ts-ignore
    auth.emit('onRegistration', authEntity);

    return {
      authCode,
      authentication: { strategy: this.name },
    };
  }

  async entityVerify(entity: any) {
    entity.verified = true;
    entity = await this.entityService.update(entity.id, entity);
    const auth = this.app!.defaultAuthentication!();
    // @ts-ignore
    auth.emit('onVerify', entity);
    return entity;
  }

  async authenticate(data: AuthenticationRequest, params: Params) {
    const { authCodeField, codeField, entity } = this.configuration;
    const code = get(data, codeField);
    const _authCode = get(data, authCodeField);
    const userId = await this.verifyCode(_authCode, code);
    const result = await this.getEntityById(userId, omit(params, 'provider'));
    let entityResponse = await this.getEntity(result, params);

    if (this.useVerify && !entityResponse.verified) {
      entityResponse = await this.entityVerify(entityResponse);
    }

    return {
      authentication: { strategy: this.name },
      [entity]: entityResponse,
    };
  }
}

export default CodeStrategy;

feathersContext.add('auth.code.strategy', CodeStrategy);
