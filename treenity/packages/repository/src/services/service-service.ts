import { Application, ServiceInterface } from '@feathersjs/feathers';
import { feathersContext } from '@treenity/feathers-service';
import Link from '../utils/link';

export class ServiceService implements ServiceInterface<any> {
  constructor() {}

  path: string = '';
  app: Application = null!;

  async setup(app: Application, path: string) {
    this.path = path;
    this.app = app;
  }

  async get(filePath: string) {
    const node = await this.app.service('/sys/tree').get(filePath);
    const link = new Link(filePath);

    const meta = node.metas[link.meta];
    const [service, options] = await feathersContext.get(meta.$type);

    return new service({ meta, node });
    // logic to retrieve tree node
  }
}
