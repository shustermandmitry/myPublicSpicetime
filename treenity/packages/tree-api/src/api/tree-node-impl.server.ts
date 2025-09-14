import { NodeEntityImpl } from '@/node-entity/node.entity';
import { Paginated } from '@feathersjs/feathers';
import { MetaName, metaType, types } from '@treenity/core';
import { Entity, entity, getEntity, method } from '@treenity/entity';
import { classFactory } from '@treenity/js-shared';
import { BadNodeTreeNameType, TreeNode, TreeNodeType } from './tree-node';

@entity(TreeNodeType.server)
export class TreeNodeImplServer extends NodeEntityImpl implements TreeNode {
  parent!: string;

  get<T>(type: MetaName<T>, path?: string): Promise<Entity<T>> {
    type = metaType(type).server;
    return super.get<T>(type, path) as Promise<Entity<T>>;
  }

  get _actions() {
    return getEntity(this).$.actions as any;
  }

  @method
  createChild(options: { name: string }): Promise<TreeNode> {
    const $actions = getEntity(this as TreeNode).$.actions;
    if (!$actions.create) throw new Error('create is not allowed');
    return $actions.create({
      parent: this.url,
      $name: options?.name,
    }) as Promise<TreeNode>;
  }

  @method
  removeNode(): Promise<void> {
    const $actions = getEntity(this).$.actions;
    if (!$actions.remove) throw new Error('remove is not allowed');
    return $actions.remove(this);
  }

  @method
  async children(): Promise<Paginated<TreeNode>> {
    // return { total: 0, limit: 10, skip: 0, data: [] };
    const result = await this._actions.service.find({ query: { path: this.url }, paginate: {} });
    return result;
  }

  @method
  async child(name: string): Promise<TreeNode> {
    return this._actions.service.get(this.url + '/' + name);
  }

  async load(): Promise<TreeNode> {
    // const item = await this.api.get(this.url);
    return null!;
  }
}

(async () =>
  types.entity.add(
    BadNodeTreeNameType.server,
    classFactory(TreeNodeImplServer),
    (await types.entity.getInfo(TreeNodeType.server)).options,
  ))();
