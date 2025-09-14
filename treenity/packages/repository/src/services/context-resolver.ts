import { getMetaByType } from '@/utils/get-meta';
import Link from '@/utils/link';
import { Application, Params, Query, Service, ServiceInterface } from '@feathersjs/feathers';
import { Node } from '@treenity/core';
import { getEntity } from '@treenity/entity';

interface Context {
  name: string;
  service: string;
}

type ContextHandler = (ctx: string) => Service | undefined;

export class ContextResolver implements ServiceInterface {
  private resolver: Service<Node> = null!;
  private contexts: Record<string, string> = {};
  private service: ContextHandler = () => ({}) as Service;

  constructor(public resolverUrl: string) {}

  async setup(app: Application, path: string) {
    this.service = (ctx: string) => app.service(this.contexts[ctx]);
    this.resolver = app.service(this.resolverUrl);

    let nodes = await this.resolver!.find!({ query: { path } }).catch((err: Error) => {
      console.warn(`Context list in path ${path} not found:`, err);
      return [];
    });
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    for (let node of nodes) {
      const ctx = getMetaByType<Context>(node, 'sys.context');
      if (!ctx) {
        console.warn(
          `⚠️ node with id ${getEntity(node).$.id} don't have meta with type "sys.context"`,
        );
        continue;
      }

      this.contexts[ctx.name] = ctx?.service;
    }
  }

  async get(filePath: string, params: Params<Query>): Promise<any> {
    const link = new Link(filePath);
    let srv = this.service(link.context);

    if (!srv) {
      srv = this.service('default');

      if (!srv) {
        return undefined;
      }
    }

    return srv.get(link.pathname, params);
  }

  // async find(params: Params<Query>): Promise<any[]> {
  //   const { resolve, ...query } = params.query || {};
  //   const nodes = await this.resolver.find({ query });
  //   if (!nodes || !Array.isArray(nodes)) throw new Error(`bad result from resolver`);
  //
  //   if (resolve === true) {
  //     for (let i = 0; i < nodes.length; i++) {
  //       const node = nodes[i];
  //       // resolve link to self.
  //       const ref = node.$refs?.find(r => r.ref === '/');
  //       if (ref) {
  //         nodes[i] = await this.get(ref.url, params);
  //       }
  //     }
  //   }
  //   return nodes;
  // }
}

export default ContextResolver;
