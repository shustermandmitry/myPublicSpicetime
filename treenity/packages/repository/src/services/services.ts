// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '@/declarations';
import EntityManagerService from '@/mods/entity/entity-manager.service';
import { getMeta } from '@/utils/get-meta';
import Link from '@/utils/link';
import { ServiceInterface } from '@feathersjs/feathers';
import { feathersContext } from '@treenity/feathers-service';
import { AutorunService } from './autorun-service';
import ContextResolver from './context-resolver';
import { dynamicService } from './dynamic-service';
import { JsonFsService } from './json-fs';
import TreeFsService from './tree-fs-service';
import { TypesTreeService } from './types-tree-service';

export async function resolveService<T = ServiceInterface>(
  app: Application,
  path: string | Link,
): Promise<T> {
  const link = new Link(path, { protocol: 'svc:' });

  // tree://repo/dir/dir/node$meta^field
  // service://repo/dir/dir/service$meta^method?path=/node/meta...
  // feathers://repo/protocol/tree:/find/me/node
  const treeService = app.service('/sys/tree');
  const node = await treeService.get(link.path, { query: { resolve: true } });
  if (!node) throw new Error(`Node not found: ${link.pathname}`);
  const meta = getMeta(node, link);

  const [service] = await feathersContext.get(meta.$type);
  return new service({ meta, node, app }) as T;
}

export const services = (app: Application) => {
  async function resolveLink(link: Link) {}

  // const resolveLink2 = async (link: Link) => {
  //   const children = link.pathname.split(':');
  //   // let parent;
  //   // find first service, then get child and find its url in children. and so on. then get last service and get field
  //   // or meta, or node.
  //   // let fullPath = [];
  //   for (const child of children) {
  //     const childLink = new Link(child, link.context);
  //     let contextService = app.service(`/sys/context/${childLink.context}`);
  //
  //     const entity = await contextService.get(childLink.path);
  //     const field = childLink.field || 'get';
  //
  //     if (typeof entity[field] === 'function') {
  //       return createMethodService(app.services[childLink.metaPath], field);
  //     } else {
  //       return createFieldService(app.services[childLink.metaPath], field);
  //     }
  //   }
  // };

  // must be before other services init
  app.configure(dynamicService(resolveService));

  app.use('/sys/fs-repo', new JsonFsService({ rootPath: app.get('tree').root }));
  app.use('/sys/ctx', new ContextResolver('/sys/fs-repo'));
  const treeFsService = new TreeFsService('/sys/fs-repo', '/sys/ctx');
  treeFsService.mount('/types', new TypesTreeService());
  app.use('/sys/tree', treeFsService);
  app.use('/sys/entity', new EntityManagerService('/sys/tree', '/sys/access-control'));
  if (process.env.NODE_ENV !== 'test') {
    app.use('/sys/autorun', new AutorunService());
  }

  const ASYNC_FUNC = async () => ({}) as any;
  app.use('/sys/context/__methods', {
    get: ASYNC_FUNC,
    find: ASYNC_FUNC,
    create: ASYNC_FUNC,
    patch: ASYNC_FUNC,
    delete: ASYNC_FUNC,
  });
};
