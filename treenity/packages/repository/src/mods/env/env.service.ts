import { feathersContext } from '@treenity/feathers-service';
import { FeathersService } from '@/utils/feathers-setup-service';
import { Params, Query, Application } from '@feathersjs/feathers';

class EnvService extends FeathersService {
  constructor() {
    super();
  }

  _setup(app: Application, path: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async get(name: string, params: Params<Query>): Promise<any> {
    return process.env[name];
  }
}

feathersContext.add('sys.env', EnvService);

export default EnvService;
