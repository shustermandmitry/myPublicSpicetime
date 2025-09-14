import { Application, Params } from '@feathersjs/feathers';
import { functionHooks } from '@feathersjs/hooks';
import { FeathersHookManager, PROTECTED_PROXY_METHODS } from '@treenity/feathers-service';
import { refreshAccessToken } from './access-token';

const customMethodsHandlers: ProxyHandler<any> = {
  get(service, prop: string | symbol) {
    if (typeof prop === 'symbol' || prop in service) return service[prop];
    if (PROTECTED_PROXY_METHODS.has(prop)) return;

    // its unknown method name
    const method = prop as string;

    return (service[method] = functionHooks(
      function (data: any, params: Params = {}) {
        const accessToken = service.app.get('cookies').accessToken;
        const run = () => service.send(method, data, params.query || {}, params.route || {});

        return run().catch((e: Error) => {
          const afterRequestToken = service.app.get('cookies').accessToken;

          if (e.name === 'NotAuthenticated' || e.message === 'jwt expired') {
            if (accessToken !== afterRequestToken) {
              return run();
            }

            return refreshAccessToken(service.app).then(() => run());
          }

          console.log('service.send error: ', e.name, '|', e.message);
          throw new Error(e.message);
        });
      },
      // code from feathersjs/feathers/hooks
      new FeathersHookManager(service.app, method).params('data', 'params').props({
        app: service.app,
        path: service.path,
        method,
        service,
        event: null,
        type: 'around',
        get statusCode() {
          return this.http?.status;
        },
        set statusCode(value: number) {
          this.http = this.http || {};
          this.http.status = value;
        },
      }),
    ));
  },
};

/**
 * patch feathers client to support custom methods. it adds proxy to every service,
 * which resolves any unknown name to new method, because we not yet know, if service
 * have any custom methods
 */
export function socketCustomMethods(app: Application): void {
  const origUse = app.use;
  // @ts-ignore
  app.use = function use(path, service, options) {
    (service as any).app = app;
    origUse.call(app, path, service, options);
    app.services[path] = new Proxy(app.services[path], customMethodsHandlers);
    return this;
  };
}
