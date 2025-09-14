import { Application } from '@/declarations';
import { AccessTokens } from '@/mods';
import SessionService from '@/mods/session/session.service';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { awaitService, feathersContext, TreenityService } from '@treenity/feathers-service';
import {
  AuthenticationParams,
  AuthenticationRequest,
  AuthenticationResult,
  JWTStrategy,
} from '@feathersjs/authentication';
import { NotAuthenticated } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import { AuthServiceMeta } from './auth.meta';
import CodeStrategy from './code.strategy';
import PasswordStrategy from './password.strategy';
import TelegramStrategy from './telegram.strategy';
import { AuthenticationServiceWithAuthCode } from './types';

export * from './auth.meta';

const DEFAULT_EXPIRES_IN_REFRESH_TOKEN = 2629743;
const DEFAULT_EXPIRES_IN_ACCESS_TOKEN = 1800;

export type CreateTokensResponse = AccessTokens;

interface KillSessionsData {
  userId: number;
}

export interface IAuthService {
  createTokens(
    authResult: AuthenticationResult,
    params?: AuthenticationParams,
  ): Promise<CreateTokensResponse>;
  remove(
    _: string,
    params: AuthenticationParams,
  ): Promise<Pick<CreateTokensResponse, 'accessToken'>>;
  killSessions(data: KillSessionsData): Promise<boolean>;
}

class AuthService extends AuthenticationServiceWithAuthCode implements IAuthService {
  sessionService!: SessionService;
  userService!: TreenityService;
  sessionServicePath!: string;
  notCheckToken = true;
  defaultRole!: string;
  customEvents: string[] = ['onCodeConfirm'];
  customMethods: string[] = ['registration', 'resendCode'];
  refreshTokenExpiresIn: number = DEFAULT_EXPIRES_IN_REFRESH_TOKEN;
  accessTokenExpiresIn: number = DEFAULT_EXPIRES_IN_ACCESS_TOKEN;
  handlers: Record<string, any> = {
    jwt: JWTStrategy,
    password: PasswordStrategy,
    code: CodeStrategy,
    telegram: TelegramStrategy,
  };

  constructor({ app, meta }: ServiceConstructorParams<AuthServiceMeta>) {
    super(app);
    const authentication = app?.get('authentication');

    if (!authentication) {
      console.warn('authentication object in config is undefined');
      return;
    }

    authentication.authStrategies.forEach((authStrategy: string) => {
      const strategyObject = this.handlers[authStrategy];
      if (!strategyObject) {
        throw new Error(`Unknown authStrategy: ${authStrategy}`);
      }
      const strategy = new strategyObject(meta);
      super.register(authStrategy, strategy);
    });

    this.sessionServicePath = meta.sessionServicePath;
    this.defaultRole = meta.defaultRole ?? this.defaultRole;
    this.refreshTokenExpiresIn = meta.refreshTokenExpiresIn ?? this.refreshTokenExpiresIn;
    this.accessTokenExpiresIn = meta.accessTokenExpiresIn ?? this.accessTokenExpiresIn;
  }

  async setup(app?: Application, path?: string) {
    await super.setup();
    const { service } = this.configuration;
    const sessionService = await awaitService(app!, this.sessionServicePath);
    this.userService = await awaitService(app!, service!);
    Object.getPrototypeOf(this).sessionService = sessionService;
  }

  async getPayload(_authResult: AuthenticationResult, params: AuthenticationParams) {
    const { user } = _authResult;
    const { payload = {} } = params;

    payload.sub = user.id;
    payload.role = user.role;
    return payload;
  }

  private async newRefreshToken(
    userId: number,
    sessionId: string,
    payload: object,
    withSession = true,
  ) {
    const data = { userId, sessionId, ...payload };
    const refreshToken = await this.createJWT(data, this.refreshTokenExpiresIn);
    if (withSession) {
      await this.sessionService.create(
        {
          userId,
          sessionId,
          payload: { ...payload, sub: userId },
        },
        { query: { EX: this.refreshTokenExpiresIn } },
      );
    }

    return refreshToken;
  }

  async newAccessToken(userId: number, sessionId: string, payload: object) {
    const data = { userId, sessionId, ...payload };
    const accessToken = await this.createJWT(data, this.accessTokenExpiresIn);
    return accessToken;
  }

  async parseJWT(token: string) {
    const tokenObject = await super.verifyAccessToken(token);
    return tokenObject;
  }

  async createJWT(payload: any, expiresIn: number) {
    return await this.createAccessToken(payload, { expiresIn });
  }

  async getSession(token: string) {
    const { userId, sessionId } = await this.parseJWT(token);
    const { data: profile } = await this.sessionService.get(userId, {
      query: { sessionId },
    });
    if (!profile) {
      throw new NotAuthenticated('Session not found');
    }
    return { ...profile, userId, sessionId };
  }

  //Override vase verifyAccessToken
  async verifyAccessToken(token: string) {
    const res = await this.getSession(token);
    return res;
  }

  public createTokens = async (
    authResult: AuthenticationResult,
    params: AuthenticationParams = {},
  ): Promise<CreateTokensResponse> => {
    const payload = await this.getPayload(authResult, params);
    const userId = authResult.user.id;
    const sessionId = crypto.randomUUID();
    const accessToken = await this.newAccessToken(userId, sessionId, payload);
    const refreshToken = await this.newRefreshToken(userId, sessionId, payload);

    return {
      accessToken,
      refreshToken,
      accessExpiredIn: this.accessTokenExpiresIn,
      refreshExpiredIn: this.refreshTokenExpiresIn,
    };
  };

  private async getAuthResult(
    data: AuthenticationRequest,
    params: AuthenticationParams,
  ): Promise<AuthenticationResult> {
    const authStrategies = params.authStrategies || this.configuration.authStrategies;
    if (!authStrategies.length) {
      throw new NotAuthenticated(
        'No authentication strategies allowed for creating a JWT (`authStrategies`)',
      );
    }

    return await this.authenticate(data, params, ...authStrategies);
  }

  async create(data: AuthenticationRequest, params: AuthenticationParams) {
    this.cleanLogin(data);
    const authResult = await this.getAuthResult(data, params);

    if (data.strategy === 'jwt') {
      await this.getSession(data.accessToken);
      return data;
    }

    return this.createTokens(Object.assign(data, authResult), params);
  }

  async remove(id: string, params: Params) {
    const token = params.headers?.authorization;
    const authentication = {
      strategy: 'jwt',
      accessToken: token,
    };
    params!.authentication = authentication;
    const { accessToken } = await super.remove(token, params);

    const { userId, sessionId } = await this.getSession(accessToken);
    await this.sessionService.remove(userId, { query: { sessionId } });

    return { accessToken };
  }

  async update(id: string, data: AuthenticationRequest) {
    const { refreshToken } = data;
    if (!refreshToken) {
      throw new NotAuthenticated('No refresh token');
    }

    try {
      const { userId, sessionId, ...otherParams } = await this.getSession(refreshToken);
      await this.userService.get(userId);

      const accessToken = await this.newAccessToken(userId, sessionId, otherParams);
      return { accessToken, accessExpiredIn: this.accessTokenExpiresIn };
    } catch (e) {
      throw new NotAuthenticated('Refresh token not updated');
    }
  }

  private cleanLogin(data: AuthenticationRequest) {
    const { lowerCaseFiled } = this.configuration;
    type AuthRequest = typeof data;
    const lowerCaseValue = lowerCaseFiled && data[lowerCaseFiled as keyof AuthRequest];
    if (lowerCaseValue) {
      data[lowerCaseFiled as keyof AuthRequest] = lowerCaseValue.toLowerCase().trim();
    }
  }

  async registration(data: AuthenticationRequest, params: AuthenticationParams = {}) {
    this.cleanLogin(data);
    return this.signUp(data, params);
  }

  async resendCode(data: AuthenticationRequest, params: AuthenticationParams = {}) {
    return this._resendCode(data, params);
  }

  async killSessions(data: KillSessionsData) {
    return this.sessionService.kill(data, {});
  }

  async teardown(app: Application, path: string) {
    console.log('teardown', path);
  }
}

export default AuthService;

feathersContext.add('sys.auth', AuthService);
