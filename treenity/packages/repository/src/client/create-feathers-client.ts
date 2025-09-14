import { deserializeEntityHook } from '@/mods/entity/deserialize-entity';
import { rewriteSubParam } from '@/mods/entity/subscribe-client';
import { Cookies, createCookies } from '@/utils/cookies';
import auth from '@feathersjs/authentication-client';
import type { Application } from '@feathersjs/feathers';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { EntityManager } from '@treenity/entity';
import { isClient, isServer } from '@treenity/js-shared';
import io from 'socket.io-client';
import { refreshAccessToken } from './access-token';
import { socketCustomMethods } from './socket-custom-methods';

interface ClientOptions {
  // server url
  url?: string;
  noAuth?: boolean;
  cookies: Cookies;
  timezone?: string;
}

export function createFeathersClient<T = {}>(
  { url, noAuth, cookies, timezone }: ClientOptions = { cookies: createCookies({}) },
): Application<T> {
  let connections = 0;
  let maxDelay = 1000;

  // const URL = /*(typeof window !== 'undefined' && window.ENV.WS_API_URL) ||*/ '/';
  url =
    url ||
    (typeof window !== 'undefined'
      ? ((window as any).ENV.WS_API_URL as string)
      : 'http://localhost:3030') ||
    '/';

  const socket = io(url, {
    path: '/socket.io',
    extraHeaders: {
      Authorization: cookies.accessToken || '',
      Timezone: timezone || '',
    },
  });

  const client = feathers().configure(socketio(socket)).configure(socketCustomMethods);
  client.set('cookies', cookies);

  socket.on('connect', async () => {
    connections = 0;
    if (!cookies.accessToken && cookies.refreshToken) {
      try {
        await refreshAccessToken(client);
      } catch (e: any) {
        if (isClient) {
          document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;

          if (e.status === 401) {
            document.cookie = `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
          }
        }
      } finally {
        isClient && window.location.reload();
      }
    }
  });

  socket.on('connect_error', async e => {
    if (e.message === 'xhr poll error')
      return console.log('connect_error', e.message, url, isServer, connections);

    console.log('connect_error', e.message, e.stack);

    if (isServer) {
      socket.close();
      return;
    }

    if (cookies.refreshToken) {
      await refreshAccessToken(client);
      isClient && window.location.reload();
    } else {
      if (isClient && cookies.accessToken) {
        document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        document.cookie = `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        window.location.reload();
      }
    }
  });

  socket.on('disconnect', () => {
    if (isServer) {
      socket.close();
      return;
    }

    setTimeout(() => socket.connect(), Math.min(connections * 50, maxDelay));
    connections++;
  });

  socket.onAny((event, data) => {
    if (!event.endsWith(' patched')) return;

    if (typeof data?.id === 'string' && Array.isArray(data.patches)) {
      client.emit('sub', data.id, data.patches);
    }
  });

  if (!noAuth) {
    client.configure(
      auth({
        path: '/sys/auth',
      }),
    );
  }

  const manager = new EntityManager('client');
  client.set('entity-manager', manager);
  client.hooks({
    before: {
      all: [rewriteSubParam()],
    },
    around: {
      all: [deserializeEntityHook('client', manager)],
    },
  });

  return client;
}

// @ts-ignore
let clientAppSingleton;
// @ts-ignore
export const clientApp = (): Application => clientAppSingleton;
export const setClientApp = (app: Application) => (clientAppSingleton = app);
