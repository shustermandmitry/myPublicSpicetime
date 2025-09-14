import { Application } from './declarations';
// import { ServiceService } from './services/service-service';
import { createApiProxy } from './utils/create-api-proxy';

function underscoreToDash(str: string) {
  return str.replace('_', '-');
}

export const callServices = (app: Application) => {
  // All services will be registered here
  // app.use('/sys/context/svc', new ServiceService());

  // app
  //   .service('svc:///sys/services$service-mgr^should')
  //   .find({ name: 'test', query: { id: 25 } })
  //   .then(console.log);

  const api = createApiProxy<any>([], {}, (path: string[], opts, ...args) => {
    const pathDash = path.map(underscoreToDash);
    const p = `${pathDash.slice(0, -2).join('/')}$${pathDash.at(-2)}^${pathDash.at(-1)}`;
    return app.service(p).find(...args);
  });

  // api.sys.services.service_mgr.should({ name: 'test', query: { id: 125 } }).then(console.log);
};
