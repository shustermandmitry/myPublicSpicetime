import { Application, FeathersService } from '@feathersjs/feathers';
import { MetaType } from '@treenity/core';

export interface ServiceWithAwaiter extends FeathersService {
  serviceAwaiter?: Promise<void>;
}

const awaitService = async <S>(app: Application, path: string, type?: MetaType<S>): Promise<S> => {
  let service: ServiceWithAwaiter = app.service(path);
  if (service.serviceAwaiter) {
    await service.serviceAwaiter;
    service = app.service(path);
  }

  return service as S;
};

export default awaitService;
