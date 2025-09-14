import { feathersContext } from '@treenity/feathers-service';
import { FeathersService } from '@/utils/feathers-setup-service';
import { Params, Query, Application } from '@feathersjs/feathers';
import { get } from '@s-libs/micro-dash';

class ConfigAdapterService extends FeathersService {
  private app: Application = null!;

  constructor() {
    super();
  }

  async setup(app: Application, path: string): Promise<void> {
    await super.setup(app, path);
    this.app = app;
  }

  async get(path: string, params: Params<Query>): Promise<any> {
    const pathItems = path.substring(1).split('/');

    if (!pathItems.length) {
      return undefined;
    }

    const root = pathItems.shift() as string;
    const configItem = this.app.get(root);
    if (!pathItems.length) {
      return configItem;
    }

    return get(configItem, pathItems);
  }
}

feathersContext.add('sys.cfg', ConfigAdapterService);

export default ConfigAdapterService;
