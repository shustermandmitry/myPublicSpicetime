import {
  Application,
  defaultEventMap,
  defaultServiceMethods,
  RealTimeConnection,
  TransportConnection,
} from '@feathersjs/feathers';
import { Service, SocketService } from '@feathersjs/transport-commons/client';
import { runMethod } from '@feathersjs/transport-commons/lib/socket/utils';

export { SocketService };

export default function testClient<Services = any>(options?: any) {
  const defaultService = function (this: Application<any>, name: string) {
    const self = this;
    const events = Object.values(defaultEventMap);
    const connection = {
      emit(method: string, ...args: any[]) {
        return runMethod(self, {} as RealTimeConnection, name, method, args);
      },
    };

    const settings = Object.assign({}, options, {
      events,
      name,
      connection,
      method: 'emit',
    });

    return new Service(settings) as any;
  };

  const initialize = function (app: Application<Services>) {
    app.defaultService = defaultService;
    app.mixins.unshift((service, _location, options) => {
      if (options && options.methods && service instanceof Service) {
        const customMethods = options.methods.filter(name => !defaultServiceMethods.includes(name));

        service.methods(...customMethods);
      }
    });
  };

  initialize.Service = Service;
  initialize.service = defaultService;

  return initialize as TransportConnection<Services>;
}

if (typeof module !== 'undefined') {
  module.exports = Object.assign(testClient, module.exports);
}
