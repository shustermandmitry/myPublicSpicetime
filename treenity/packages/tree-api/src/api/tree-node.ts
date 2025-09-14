import { Paginated } from '@feathersjs/feathers';
import { MetaName, MetaPath, MetaPermission, metaType, Node } from '@treenity/core';
import { Entity } from '@treenity/entity';

export interface ChildrenLoadOptions {
  // load metas, true by default
  withMeta?: boolean;
}

export interface TreeNode extends Node {
  $perm: MetaPermission;
  parent: string;

  get<T>(type: MetaName<T>, path?: MetaPath): Promise<Entity<T>>;

  createChild(options: { name: string }): Promise<TreeNode>;
  removeNode(): Promise<void>;

  children(options?: ChildrenLoadOptions): Promise<Paginated<TreeNode>>;
  load(): Promise<TreeNode>;

  child(name: string): Promise<TreeNode>;
}

export type TreeNodeAny = TreeNode & {
  [field: string]: TreeNode & (<T>(type: MetaName<T>, path?: MetaPath) => Promise<Entity<T>>);
}

export const TreeNodeType = metaType<TreeNode>('tree-node');
export const BadNodeTreeNameType = metaType<TreeNode>('node_tree');
