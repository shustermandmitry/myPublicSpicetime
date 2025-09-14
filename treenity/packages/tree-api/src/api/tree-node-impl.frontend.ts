import { NodeEntityImpl } from '@/node-entity/node.entity';
import { Paginated } from '@feathersjs/feathers';
import { MetaName, MetaPath, types } from '@treenity/core';
import { Entity, entity, method } from '@treenity/entity';
import { classFactory } from '@treenity/js-shared';
import { BadNodeTreeNameType, TreeNode, TreeNodeType } from './tree-node';

// export function RemoteFunction<R, A extends any[] = []>(
//   optimisticFunction?: (...args: A) => Promise<R>,
// ): (...args: A) => Promise<R> {
//   return Object.create(RemoteFunction, {
//     optimisticFunction: { value: optimisticFunction },
//   });
// }

@entity(TreeNodeType.client)
// @ts-ignore
export class TreeNodeImplClient extends NodeEntityImpl implements TreeNode {
  parent!: string;

  @method
  createChild(options?: { name: string }): Promise<TreeNode> {
    return undefined!;
  }

  @method
  removeNode(): Promise<void> {
    return undefined!;
  }

  get<T>(type: MetaName<T>, path?: MetaPath): Promise<Entity<T>> {
    return super.get(type, path) as Promise<Entity<T>>;
  }

  @method
  children(): Promise<Paginated<TreeNode>> {
    return undefined!;
  }

  @method
  child(name: string): Promise<TreeNode> {
    return undefined!;
  }

  //
  async load(): Promise<TreeNode> {
    // const item = await this.api.get(this.url);
    return null!;
  }
}

(async () =>
  types.entity.add(
    BadNodeTreeNameType.client,
    classFactory(TreeNodeImplClient),
    (await types.entity.getInfo(TreeNodeType.client)).options,
  ))();
