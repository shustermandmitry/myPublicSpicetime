import { AuthDataValidator, searchParamsToAuthDataMap } from '@telegram-auth/server';
import { Application } from '@/declarations';
import { TelegramUserType } from '@/mods/telegram-user/telegram-user.entity';
import { awaitService } from '@/utils/index';
import { AuthenticationBaseStrategy, AuthenticationRequest } from '@feathersjs/authentication';
import { get } from '@s-libs/micro-dash';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';
import { NotAuthenticated, Params, feathersContext } from '@treenity/feathers-service';

class TelegramStrategy extends AuthenticationBaseStrategy {
  defaultRole!: string;

  constructor(meta: { defaultRole: string }) {
    super();
    this.defaultRole = meta.defaultRole;
  }

  get configuration() {
    const authConfig = this.authentication!.configuration;
    const config = super.configuration || {};
    const node_env = process.env.NODE_ENV;
    return {
      service: authConfig.service,
      entity: authConfig.entity,
      entityId: authConfig.entityId,
      errorMessage: 'Invalid login',
      isProduction: node_env === 'production',
      ...config,
    };
  }

  verifyConfiguration() {
    const config = this.configuration;

    ['token'].forEach(prop => {
      if (typeof config[prop] !== 'string') {
        throw new Error(`'${this.name}' authentication strategy requires a '${prop}' setting`);
      }
    });
  }

  async authenticate(data: AuthenticationRequest, params: Params) {
    const { token, telegramUserServicePath, errorMessage, entity } = this.configuration;
    const authData: string = get(data, 'data');

    let parsedData: InitData;
    try {
      validate(authData, token, { expiresIn: 3600 });
      parsedData = parse(authData);
    } catch (error) {
      // Desktop
      const validator = new AuthDataValidator({ botToken: token });
      const data2 = searchParamsToAuthDataMap(new URLSearchParams(authData));
      const res = await validator.validate(data2);
      parsedData = {
        user: {
          id: res.id,
          firstName: res.first_name,
          lastName: res.last_name,
          photoUrl: res.photo_url,
          languageCode: res.language_code,
          username: res.username,
          isPremium: false,
        },
      } as InitData;
    }

    const telegramUserService = await awaitService(
      this.app as Application,
      telegramUserServicePath,
      TelegramUserType,
    );

    if (!parsedData.user?.id) {
      throw new NotAuthenticated('TUser ID not found');
    }

    const tUser = await telegramUserService.find({
      query: { tuser: parsedData.user?.id },
    });

    let user;
    if (!tUser.length) {
      // TODO: Domain
      const email = `t_${parsedData.user?.id}@telegram.zeeu.app`;
      user = await this.entityService
        .get(null!, {
          query: { email },
        })
        .catch(() => undefined);

      if (!user) {
        user = await this.entityService.create({
          email,
          password: crypto.randomUUID(),
          lang: parsedData.user?.languageCode || 'en',
          role: this.defaultRole,
          first_name: parsedData.user.firstName,
          last_name: parsedData.user.lastName,
          photo: parsedData.user.photoUrl,
          // TODO:
          // strategy: 'telegram',
        });
      }

      await telegramUserService.create(
        {
          tuser: BigInt(parsedData.user!.id!),
          chat_instance: BigInt(parsedData.chatInstance || '0'),
          user_id: user.id,
          user_name: parsedData.user?.username,
          is_premium: parsedData.user?.isPremium,
        },
        {},
      );
    } else {
      const [telegramUser] = tUser;
      user = await this.entityService.get(telegramUser.user_id);
    }

    if (!user) {
      throw new NotAuthenticated('User not found');
    }

    return {
      authentication: { strategy: this.name },
      [entity]: user,
    };
  }
}

export default TelegramStrategy;

feathersContext.add('auth.telegram.strategy', TelegramStrategy);
