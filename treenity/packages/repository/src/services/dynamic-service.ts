// 'use server';

import { Application } from '@/declarations';
import { stripSlashes } from '@feathersjs/commons';
import {
  defaultServiceEvents,
  defaultServiceMethods,
  PROTECTED_PROXY_METHODS,
  ServiceInterface,
} from '@treenity/feathers-service';
import { type Promised, promised } from '@treenity/js-shared/utils';
import Link from '../utils/link';

type IServiceProxy = {
  id: string;
  serviceAwaiter: Promised<void>;
  recall(svc: ServiceInterface): void;
};

const temporaryServiceProxyHandlers: ProxyHandler<any> = {
  get(target: any, name: string | symbol) {
    if (name in target || typeof name === 'symbol') return target[name];
    // when use feathers app.use, it checks for this methods to add as express app
    if (PROTECTED_PROXY_METHODS.has(name)) return;

    return (target[name] = function methodFunc(...args: any[]): Promise<any> {
      const prom = promised<any>();
      target.calls.push([name, args, prom]);
      return prom;
    });
  },
};

/**
 * Temporary service, it collects calls to its methods like mock, and then re-execute
 * them on real service, returning original results to the caller side
 * @param app
 * @param path
 */
export function createTemporaryServiceProxy<T>(
  app: Application,
  path: string,
): ServiceInterface<T> & IServiceProxy {
  console.log('➡️️ Creating service', path);

  return new Proxy(
    {
      id: path,
      serviceAwaiter: promised<void>(),
      calls: [],
      /**
       * replay all collected calls
       * @param svc
       */
      recall(svc: ServiceInterface) {
        for (const [name, args, prom] of this.calls) {
          console.log('recall', name, args[0]);
          // @ts-ignore
          if (!svc[name]) {
            prom.reject(new Error(`method ${name} not found`));
          } else {
            try {
              // const hookContext = last<HookContext>(args);
              // runMethod(app, hookContext.params.connection, hookContext.path, name, args);
              // XXX cant run this way here, it will be security issue on first non-registered aservice call,
              //  any methods will run, should use `runMethod`
              const res = (svc as any)[name](...args);
              if (typeof res?.then === 'function') {
                res.then(prom.resolve, prom.reject);
              } else {
                prom.reject(`Method '${name}' not returned promise`);
              }
            } catch (err) {
              prom.reject(err);
            }
          }
        }
      },
    },
    temporaryServiceProxyHandlers,
  );
}

const errorServiceProxyHandlers = {
  get(target: any, name: string) {
    if (name in target || typeof name === 'symbol') return target[name];
    // when use feathers app.use, it checks for this methods to add as express app
    if (PROTECTED_PROXY_METHODS.has(name)) return undefined;
    // if (defaultServiceMethods.includes(name as string)) {
    return (target[name] = async () => {
      void target.app.unuse(target.path);
      throw new Error(`service ${target.path} not found while ${name.toString()}`);
    });
  },
};

function createErrorService(app: Application, path: string): any {
  return new Proxy({ path, app }, errorServiceProxyHandlers);
}

export const dynamicService = (
  findService: (app: Application, path: string) => Promise<ServiceInterface>,
) =>
  function patchServiceLookup(app: Application) {
    function tryInitService(app: Application, path: string) {
      path = stripSlashes(path);

      const serviceProxy = createTemporaryServiceProxy(app, path);

      findService(app, path)
        .catch(err => {
          console.error('can not find service', path, err);
          const options = {};
          return createErrorService(app, path);
        })
        .then(async svc => {
          await app.unuse(path);

          try {
            app._isSetup = false; // disasble auto-setup for this service on `.use`
            app.use(path, svc);
          } finally {
            app._isSetup = true;
          }

          const service = app.service(path);
          await service.setup?.(app, path);

          // wait till setup will be finished
          serviceProxy.recall(service);

          serviceProxy.serviceAwaiter.resolve();
        });

      return serviceProxy;
    }

    const origLookup = app.lookup;
    app.lookup = function lookup(path: string) {
      const link = new Link(path);
      const orig = origLookup.call(app, link.path);
      if (orig) return orig;

      const serviceProxy = tryInitService(app, link.path);
      app.use(link.path, serviceProxy);

      return {
        service: app.service(link.path),
        params: {},
      };
    };

    // replace app.use method to support service.customMethods and service.customEvents
    const origUse = app.use;
    app.use = function dynamicServiceUse(...args: [string, any, any]) {
      let [path, service, options] = args;

      if (!service) return origUse.apply(app, args);

      options = { ...options };

      const methods =
        service.getCustomMethods?.() ||
        (service.customMethods && [
          ...defaultServiceMethods.filter(method => method in service),
          ...service.customMethods,
        ]);
      const events =
        service.getCustomEvents?.() ||
        (service.customEvents && [...defaultServiceEvents, ...service.customEvents]);

      methods && (options.methods = methods);
      events && (options.events = events);
      if (methods || events) args[2] = options;

      return origUse.apply(app, args);
    } as typeof origUse;

    app.defaultService = function (path) {
      // init real service initialization
      return tryInitService(app, path);
    };
  };
