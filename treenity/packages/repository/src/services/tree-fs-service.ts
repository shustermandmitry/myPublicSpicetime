import { Application, NullableId, Paginated, Query, Service } from '@feathersjs/feathers';
import { set } from '@s-libs/micro-dash';
import { Link, Node, NodeRaw, NodeRef } from '@treenity/core';
import { Params, TreenityService } from '@treenity/feathers-service';
import { Operation } from 'fast-json-patch';
import path from 'path';

// need this to convert type to match interface. NodeRaw to Node will be converted by entity system feathers hooks
function rawToNode(nodeRaw: NodeRaw): Node {
  return nodeRaw as unknown as Node;
}

export interface TreeService {
  get(path: string): Promise<NodeRaw>;
  children(parent: string): Promise<Paginated<NodeRaw>>;
  create?(path: string, data: any): Promise<NodeRaw>;
  remove?(path: string): Promise<NodeRaw>;
  update?(path: string, data: any): Promise<NodeRaw>;
}

export class TreeFsService extends TreenityService<Node, Partial<Node>, Params, Operation[]> {
  resolver: TreenityService<NodeRaw> = null!; // any
  refResolver: Service = null!;
  private app!: Application;

  private mounts: Record<string, TreeService> = {};

  constructor(
    public resolverUrl: string,
    public refResolverUrl: string,
  ) {
    super();
  }

  async setup(app: Application, path: string) {
    this.app = app;
    this.resolver = app.service(this.resolverUrl) as unknown as TreenityService<NodeRaw>;
    this.refResolver = app.service(this.refResolverUrl);
  }

  private async resolveRefs(node: NodeRaw) {
    if (!node.refs || !this.refResolver) {
      return;
    }

    for (const item of node.refs) {
      const refNode = await this.refResolver.get(item.url);
      if (refNode) {
        const path = item.ref.substring(1).split('/');
        set(node, path, refNode);
      }
    }
  }

  fixNode(node: NodeRaw) {
    const nodeAny = node as any;

    nodeAny.$$id = nodeAny.$id;
    nodeAny.$id = nodeAny.path || '/';
    nodeAny.$name = path.basename(nodeAny.path);
    node.refs ??= nodeAny.$refs;
    node.default ??= nodeAny.defaultMeta;
    node.url ??= new Link(nodeAny.path).toString();
  }

  async resolveNode(node: NodeRaw, params: Params<Query>): Promise<NodeRaw> {
    const ref = node.refs?.find((r: NodeRef) => r.ref === '/');
    if (ref) {
      return this.get(ref.url, params) as unknown as NodeRaw;
    }
    await this.resolveRefs(node);
    return node;
  }

  async get(path: string, params: Params<Query>): Promise<Node> {
    const pathname = new Link(path).pathname;

    const mounted = await this.proxyMounted<Node>('get', pathname);
    if (mounted) return mounted;

    const node = await this.resolver.get(pathname);
    if (!node) throw new Error(`Node not found: ${pathname}`);

    this.fixNode(node);
    if (params.query?.resolve === true) return this.resolveNode(node, params) as unknown as Node;

    return node as unknown as Node;
  }

  private async proxyMounted<R>(
    method: string,
    path: string,
    ...args: any[]
  ): Promise<R | undefined> {
    const [mountPath, mount] = this.findMount(path);
    const proxyPath = mountPath && path.substring(mountPath.length);
    if (mount) return (mount as any)[method](proxyPath, ...args) as Promise<R>;
  }

  private findMount(path: string): [string | undefined, TreeService | undefined] {
    const mounted = Object.keys(this.mounts);
    for (const mount of mounted) {
      if (path.startsWith(mount)) return [mount, this.mounts[mount]];
    }
    return [undefined, undefined];
  }

  async find(params: Params<Query>): Promise<Node[]> {
    const { paginate, query = {} } = params;
    const { resolve, ...queryParams } = query;

    queryParams.path &&= new Link(queryParams.path as string).pathname;

    const mounted = await this.proxyMounted<Node[]>('children', queryParams.path);
    if (mounted) return paginate ? mounted : (mounted as any).data;

    const nodes = await this.resolver.find({ query: queryParams, paginate });

    const data = (paginate ? (nodes as any).data : nodes) as NodeRaw[];

    if (!data || !Array.isArray(data)) throw new Error(`bad result from resolver`);

    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      this.fixNode(node);
      if (resolve === true) data[i] = await this.resolveNode(node, params);
    }

    return nodes as unknown as Node[];
  }

  async create(data: any, params?: Params<Query>): Promise<Node> {
    const node = await this.resolver.create(
      {
        metas: {},
        ...data,
        // $id: uuid7(),
        $type: 'node_tree',
      },
      params,
    );
    this.fixNode(node);

    return rawToNode(node);
  }

  async remove(id: string, params?: Params<Query>): Promise<Node> {
    const node = await this.resolver.remove(id, params);
    this.fixNode(node);
    return rawToNode(node);
  }

  async patch(id: NullableId, data: any, params?: Params<Query>): Promise<Node> {
    return rawToNode(await this.resolver.patch(id, data, params));
  }

  mount(path: string, tree: TreeService) {
    this.mounts[path] = tree;
  }
}

export default TreeFsService;
