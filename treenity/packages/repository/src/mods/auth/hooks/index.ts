import { clientApp } from '@/client/create-feathers-client';
import { telegramHandler } from '@/mods/auth/hooks/handlers/telegram';
import { Cookies } from '@/utils/cookies';
import { createStore } from '@treenity/ui-kit/store';
import { createContext, useContext } from 'react';
import parseJwt from '../utils/parse-jwt.client';
import { codeHandler } from './handlers/code';
import { passwordHandler } from './handlers/password';
import {
  AccessTokens,
  AuthStrategyType,
  IAuthStoreFull,
  IBaseClientApi,
  IHandler,
  IRegistrationData,
  ISignInData,
  ITelegramSignInData,
} from './types';

export interface AuthStoreParams<ClientApi extends IBaseClientApi> {
  cookies: Cookies;
  strategy: AuthStrategyType;
  redirectLogoutClient: string;
  redirectLogoutServer: string;
  clientApi: ClientApi;
}

export const createAuthStore = ({
  strategy,
  cookies,
  redirectLogoutClient,
  redirectLogoutServer,
  clientApi,
}: AuthStoreParams<IBaseClientApi>) => {
  const store = createStore<IAuthStoreFull>((set, get) => ({
    handlers: {
      code: codeHandler(clientApi),
      password: passwordHandler(clientApi),
      telegram: telegramHandler(clientApi),
    },

    getHandler(key: AuthStrategyType): IHandler {
      const handler = get().handlers[key];
      if (!handler) {
        throw new Error(`Handler for ${key} not found`);
      }

      // @ts-ignore
      return handler;
    },

    async registration(data: IRegistrationData) {
      const handler = get().getHandler(strategy);
      return handler.registration(data);
    },

    async signIn(data: ISignInData | ITelegramSignInData) {
      let strategyLoc = strategy;
      if ('strategy' in data) {
        strategyLoc = data.strategy;
      }
      const handler = get().getHandler(strategyLoc);

      const tokens = await handler.signIn(data);
      if (tokens) {
        await get().setTokens(tokens);
        const user = parseJwt(tokens.accessToken);
        return { ...user, ...tokens };
      }

      return tokens;
    },

    async resend() {
      const handler = get().getHandler(strategy);
      return handler.resend();
    },

    isAuth() {
      return !!cookies.accessToken;
    },

    async setTokens(tokens: AccessTokens) {
      cookies('accessToken', tokens.accessToken, tokens.accessExpiredIn);
      cookies('refreshToken', tokens.refreshToken, tokens.refreshExpiredIn);
      clientApp().io!._opts.extraHeaders = { Authorization: tokens.accessToken || '' };
    },

    logout() {
      cookies('accessToken', '');
      cookies('refreshToken', '');

      if (typeof window !== 'undefined') {
        void clientApp().logout();

        // reload page to reset stores
        location.assign(redirectLogoutClient);
      }

      location.assign(redirectLogoutServer);
    },

    async check(path: string) {
      return await clientApi.sys.access_control.check({
        query: {
          path: '/pages' + path,
        },
      });
    },
  }));

  return store;
};
export type AuthStore = ReturnType<typeof createAuthStore>;
export const AuthStoreContext = createContext<AuthStore>(null!);
export const useAuth = () => useContext(AuthStoreContext)();
