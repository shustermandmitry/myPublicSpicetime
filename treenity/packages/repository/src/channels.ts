// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { AuthenticationResult } from '@feathersjs/authentication';
import '@feathersjs/transport-commons';
import type { Params } from '@feathersjs/feathers';
import type { Application, HookContext } from './declarations';

export const channels = (app: Application) => {
  app.on('login', (authResult: AuthenticationResult, { connection }: Params) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.publish('patched', (data: any, context: HookContext) => {
    // publish patches to all subscribed to the id of object
    if (typeof data?.id === 'string' && Array.isArray(data.patches)) {
      return app.channel(data.id);
    } else if (data?.id != null) {
      console.warn('Not have id string in data');
    }
  });
};
