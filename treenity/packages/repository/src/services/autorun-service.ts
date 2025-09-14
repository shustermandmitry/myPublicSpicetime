import { Application, ServiceInterface } from '@feathersjs/feathers';
import { Node } from '@treenity/core';

const DEFAULT_DEPTH = 5;

export class AutorunService implements ServiceInterface<any> {
  constructor() {}

  async setup(app: Application, path: string) {
    const nodes: Node[] = await app
      .service('/sys/tree')
      .find({ query: { path, resolve: true, depth: DEFAULT_DEPTH } })
      .catch(error => {
        console.warn(`Error while starting autorun`, error);
        return [];
      });

    nodes.forEach(node => {
      app.lookup(node.url);
    });
  }

  async get() {
    return {};
  }
}
