import { Application } from '@feathersjs/feathers';
import { Entity, EntityManager } from '@treenity/entity';
import { TreenityPaginationService } from '@treenity/feathers-service';
// import { types as StreamTypes } from '@treenity/streams';
// import { collectProtocol } from '@treenity/streams/react';
// @ts-ignore
// import subscribe from 'callbag-subscribe';
import * as FastPatch from 'fast-json-patch';
import useSWR from 'swr';
import { SWRConfiguration } from 'swr/_internal';
import useSWRSubscription, { SWRSubscriptionResponse } from 'swr/subscription';
import { TreeNode } from './tree-node';
import { MetaName } from '@treenity/core';

export type Patch = FastPatch.Operation;

// type IClient = Application;

// const BASE_TREE_URL = 'txt://common.repo';
//
// // type ISub = StreamTypes.ISub<StreamTypes.DataUpdate, StreamTypes.DataUpdate>;
// // type Optional<T, K extends keyof any> = Omit<T, K> & Partial<T>;
//
// type NodePatchFn = (node: NodeEntityImpl) => NodeEntityImpl | void;
//
// const createNodeCache = () =>
//   memoize(
//     (url: string, api: TreenityPaginationService<NodeRaw>) => null!,
//     // new TreeNodeImplClient({ url }, {} as Meta<TreeNodeImplClient>, api),
//   );

const TREE_SERVICE = '/sys/tree';

export class TreeApi {
  private service: TreenityPaginationService<Entity<TreeNode>>;
  private manager: EntityManager;

  constructor(public client: Application) {
    this.service = client.service(TREE_SERVICE) as unknown as TreenityPaginationService<
      Entity<TreeNode>
    >;
    this.manager = client.get('entity-manager');
  }

  node(url: string): Promise<Entity<TreeNode>> {
    return this.manager.get(url) || this.service.get(url, { entity: true });
  }

  useNode(
    url: string,
    config?: SWRConfiguration,
  ): SWRSubscriptionResponse<Entity<TreeNode>, Error> {
    return useSWR<Entity<TreeNode>, Error, string>(
      'node+' + url,
      key => {
        return this.service.get(url, { query: {}, entity: true });
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...config,
      },
    );
  }

  useSubNode(
    url?: string,
    config?: SWRConfiguration,
  ): SWRSubscriptionResponse<Entity<TreeNode>, Error> {
    return useSWRSubscription<Entity<TreeNode>, Error, string>(
      'sub-node+' + url,
      (key, { next }) => {
        if (url) {
          this.service
            .get(url, { query: { sub: true }, entity: true })
            .then(result => next(undefined, result), next);
        }

        // TODO unsub function
        return () => {};
      },
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...config,
      },
    );
  }

  // useSubChildren(url: string, options?: ChildrenLoadOptions) {
  //   return useSWRSubscription<Paginated<TreeNode>, Error, string>(
  //     'sub-children+' + url,
  //     (key, { next }) =>
  //       this.node(url)
  //         .children(options)
  //         .then(result => next(undefined, result), next),
  //   );
  // }
}
