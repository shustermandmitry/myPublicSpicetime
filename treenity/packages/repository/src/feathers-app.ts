// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import {
  ApplicationHookOptions,
  defaultServiceEvents,
  feathers,
  HookFunction,
  SERVICE,
} from '@/feathers';
import timeOffsetHook from '@/hooks/time-offset-hook';
import { authenticate, checkPermission } from '@/mods/access-control/hooks';
import { deserializeEntityHook } from '@/mods/entity/deserialize-entity';
import configuration from '@feathersjs/configuration';
import feathersExpress, { cors, json, urlencoded } from '@feathersjs/express';
import { HookContext } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import { forEach } from '@s-libs/micro-dash';
import bodyParser from 'body-parser';
import express from 'express';

import { channels } from './channels';
import { configurationValidator } from './configuration';
import './mods';
import { Application } from './declarations';
import { errorHandler, notFound } from './error-handler';
import { logger } from './logger';
import { subscribe, unsubscribe } from './mods/entity/subscribe';
import { services } from './services';
import { toJS } from 'mobx';

(globalThis as any).toJS = toJS;

export interface CreateApp {
  fullApp: boolean;
  dontCheckPermission?: boolean;
  apiPrefix?: string;
  config?: any;
}

// @ts-ignore
const getRawBody = async (req, res, buf) => {
  req.rawBody = buf.toString();
};

export function createApp({ fullApp, config, apiPrefix, ...rest }: CreateApp = { fullApp: true }) {
  const app = feathersExpress(feathers());

  // Load app configuration
  app.configure(configuration(configurationValidator));

  // define service options on the app so that we could add global patches publisher
  (app as any)[SERVICE] = {
    serviceEvents: [...defaultServiceEvents, 'sub'],
  };

  if (config) {
    forEach(config, (value: any, key: string) => {
      app.set(key, value);
    });
  }

  if (fullApp) {
    app.use(cors());
    app.use(
      json({
        verify: getRawBody,
      }),
    );
    app.use(urlencoded({ extended: true, verify: getRawBody }));
  }
  const restApp = express();
  restApp.use(bodyParser.urlencoded({ extended: true, verify: getRawBody }));
  restApp.use(
    json({
      verify: getRawBody,
    }),
  );
  app.use(apiPrefix ? apiPrefix : '/', restApp);
  app.set('restApp', restApp as any);

  // Configure services and real-time functionality
  app.configure(
    socketio({
      cors: {
        origin: '*', //app.get('origins'),
        methods: ['GET', 'POST'],
        credentials: true,
      },
    }),
  );
  app.configure(services);
  app.configure(channels);

  // Configure a middleware for 404s and the error handler
  app.use(notFound());
  app.use(errorHandler({ logger }));

  // Register hooks that run on all service methods
  const logErrorHook: HookFunction = (context: HookContext) => {
    logger.error(context.error.stack);
  };

  app.set('dontCheckPermission', rest.dontCheckPermission);

  app.hooks({
    before: {
      all: [unsubscribe(), authenticate(), timeOffsetHook, checkPermission],
    },
    after: {
      all: [subscribe()],
    },
    error: {
      all: [logErrorHook],
    },
  } as ApplicationHookOptions<Application>);

  // this should be the last one, to catch auth info
  app.hooks({
    around: {
      all: [deserializeEntityHook('server')],
    },
  });

  // Register application setup and teardown hooks here
  app.hooks({
    setup: [],
    teardown: [],
  });

  return app;
}

let app;
export const singleton = () => (app ??= createApp());
