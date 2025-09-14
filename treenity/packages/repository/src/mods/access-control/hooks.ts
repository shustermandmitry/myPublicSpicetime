import type { Application } from '@/declarations';
import { parseCookies } from '@/utils/cookies';
import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext, HookFunction } from '@feathersjs/feathers';
import { flatten, omit } from '@s-libs/micro-dash';

export const checkPermission: HookFunction = async (context: HookContext) => {
  const { app, path, params } = context;
  const method = params.__method || context.method;
  const arg = context.arguments.find(arg => !!arg?.provider);
  if (arg?.provider !== 'socketio' && arg?.provider !== 'rest') {
    return;
  }

  const argIndex = context.arguments.findIndex(arg => !!arg?.provider);
  context.arguments[argIndex] = omit(arg, 'provider', 'authentication');
  const service = app.service('/sys/access-control');
  // @ts-ignore failed in tests
  await service.check(
    {
      query: {
        path,
        method,
      },
    },
    {
      user: arg?.user,
      authentication: arg?.authentication,
      authenticated: arg?.authenticated,
    },
  );
};

export const authenticate = (
  originalSettings: string = 'jwt',
  ...originalStrategies: string[]
): HookFunction => {
  const settings =
    typeof originalSettings === 'string'
      ? { strategies: flatten([originalSettings, ...originalStrategies]) }
      : originalSettings;

  if (!originalSettings || settings.strategies.length === 0) {
    throw new Error('The authenticate hook needs at least one allowed strategy');
  }

  return async (context: HookContext) => {
    const args = context.arguments;
    const isNotCheck = context?.self?.notCheckToken;
    const { app, type } = context;
    if (isNotCheck) {
      try {
        const argWithHeaders = args.find(arg => !!arg?.headers);
        if (!argWithHeaders) {
          return;
        }
        // argWithHeaders = omit(argWithHeaders, 'provider', 'authentication');
        delete argWithHeaders['provider'];
        delete argWithHeaders['authentication'];
      } catch (e: any) {
        console.log('parseAuthentication catch');
        return;
      }
    } else {
      await parseAuthentication(app, args);
    }
    const argWithAuthentication = args.find(arg => !!arg?.authentication);
    if (!argWithAuthentication) {
      return;
    }

    if (type && type !== 'before' && type !== 'around') {
      throw new NotAuthenticated('The authenticate hook must be used as a before hook');
    }

    const { authenticated, authentication, provider } = argWithAuthentication;
    // @ts-ignore
    const authService = app.defaultAuthentication(settings.service);
    if (!authService || typeof authService.authenticate !== 'function') {
      throw new NotAuthenticated('Could not find a valid authentication service');
    }

    if (authenticated === true) {
      argWithAuthentication.provider = undefined;
      return;
    }
    if (authentication) {
      const authParams = omit(argWithAuthentication, 'provider', 'authentication');

      if (!context.params.__method) {
        context.params.__method = context.method;
      }

      const authResult = await authService?.authenticate(
        authentication,
        authParams,
        ...settings.strategies,
      );

      Object.assign(argWithAuthentication, omit(authResult, 'accessToken'), {
        authenticated: true,
        user_id: authResult.user.id,
        role: authResult.user.role,
      });
    } else if (provider) {
      throw new NotAuthenticated('Not authenticated');
    }
  };
};

const parseAuthentication = async (app: Application, args: any[]) => {
  const argWithHeaders = args.find(arg => !!arg?.headers);
  if (!argWithHeaders) {
    return;
  }

  const service = app.defaultAuthentication?.();
  if (!service) {
    return;
  }

  // XXX HACK
  const cookies = parseCookies(argWithHeaders.headers['cookie'] || '');
  const token = cookies.accessToken;
  if (token) {
    argWithHeaders.headers.authorization = token;
  }
  // XXX HACK

  const config = service.configuration;
  const authStrategies = config.parseStrategies || config.authStrategies || [];
  if (authStrategies.length === 0) {
    return;
  }

  const authentication = await service.parse(argWithHeaders as any, {} as any, ...authStrategies);
  if (authentication) {
    Object.assign(argWithHeaders, { authentication });
  }
};
