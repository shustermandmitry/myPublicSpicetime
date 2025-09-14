import { CallChain, chainCall } from '@treenity/call-chain';
import {
  getTypeName,
  MetaName,
  MetaPath,
  MetaPermission,
  MetaRaw,
  metaType,
  Node,
  NodeRef,
  pathToString,
  serializeMeta,
} from '@treenity/core';
import {
  entity,
  Entity,
  getEntity,
  makeDerivedActions,
  method,
  writeMethod,
} from '@treenity/entity';
import { Raw } from '@treenity/js-shared/utils';
import { toJS } from 'mobx';
import { v7 as uuid7 } from 'uuid';

export const NodeEntityType = metaType<Node>('node');

/**
 * finding not used field in the object
 */
function findSlot(obj: Record<string, any>, prefix: string): string {
  let i = 0;
  let name = prefix;
  while (Object.hasOwn(obj, name)) {
    name = prefix + i++;
  }
  return name;
}

@entity(NodeEntityType)
export class NodeEntityImpl implements Node {
  $perm!: MetaPermission;
  /**
   * if ref exists in $refs, then field value will be replaced with value pointed by NodeRef.url
   */
  refs!: NodeRef[];
  url!: string;
  metas!: { [name: string]: MetaRaw };
  default?: string;

  _metas?: MetaRaw[];

  path: string = '';

  allRaw(): MetaRaw[] {
    return (this._metas ||= Object.entries(this.metas).map(([name, meta]) => {
      meta.$name = name;
      return meta;
    }));
  }

  nameByPath(path: MetaPath): string | undefined {
    path = pathToString(path);

    // path to $metaName
    if (path[0] === '$') {
      return path.slice(1);
    } else if (path[0] === '#') {
      const metaTag = path.slice(1);
      return this.allRaw().find(m => m.$tg?.includes(metaTag))?.$name;
    } else {
      throw new Error('search by path in NodeImpl not implemented');
    }
  }

  raw<T>(type: MetaName<T>, path?: MetaPath): T | undefined {
    const $type = metaType(type);
    let meta: MetaRaw | undefined;

    if (path) {
      const metaName = this.nameByPath(path);

      meta = metaName ? this.metas[metaName] : undefined;
      if (!meta) return;

      if (!$type.isEqual(meta.$type, false)) {
        throw new Error(`Meta type mismatch: expected '${path}', got '${$type}'`);
      }

      if (meta) meta.$name = metaName;
    } else {
      meta = this.allRaw().find(m => m.$type === $type.$type);
    }

    return toJS(meta) as T;
  }

  async get<T>(type: MetaName<T>, path?: MetaPath): Promise<T> {
    const raw = this.raw(type, path);
    if (!raw) {
      throw new Error(
        `entity ${path ? `${path} (${getTypeName(type)})` : getTypeName(type)} in ${this.url} not found`,
      );
    }

    const self = getEntity<NodeEntityImpl>(this);

    // try first get from cache
    const entity = self.$.manager.get((raw as any).$id, type);
    if (entity) return Promise.resolve(entity as T);

    const getMetaPrefix = (entity: Entity<T>) => {
      const metaName = entity.$.meta.$name;
      // const metaName = Object.entries(self.metas).find(m => m[1].$id === id)?.[0];
      if (!metaName) {
        throw new Error(`meta ${entity.$.id} not found in node ${self.$.id}`);
      }
      return '/metas/' + metaName;
    };
    const _callRemote = (entity: Entity<any>, method: string, args: any[]) => {
      return this._call(entity.$.meta.$name, entity.$.type.$type, method, args);
    };

    const actions = makeDerivedActions<T, any>(self, getMetaPrefix, _callRemote);

    return self.$.manager.ensure(raw, actions, type) as Promise<T>;
  }

  /**
   * Method will call real meta method inside the node
   * @param metaName
   * @param type
   * @param method
   * @param args
   */
  @method
  _call(metaName: string, type: string, method: string, args: any[]): Promise<any> {
    if (getEntity(this).$.type.$context === 'server') {
      return this.get(metaType<Record<string, any>>(type, 'server'), '$' + metaName).then(
        entity => {
          return entity[method](...args);
        },
      );
    }
    return undefined!;
  }

  get $$(): CallChain<Node> {
    return chainCall<Node>(this);
  }

  async add<T>(
    this: Entity<NodeEntityImpl>,
    type: MetaName<T>,
    meta: Raw<T>,
    metaPath?: string,
  ): Promise<T> {
    const metaName = await this._add(type, meta, metaPath);

    return this.get(type, '$' + metaName);
  }

  @writeMethod
  async _add<T>(
    this: Entity<NodeEntityImpl>,
    type: MetaName<T>,
    meta: Raw<T>,
    metaPath?: string,
  ): Promise<string> {
    const anyMeta = serializeMeta(meta) ?? {};
    anyMeta.$id = uuid7();
    anyMeta.$type = metaType(type).$type;

    const metaName = metaPath || findSlot(this.metas, anyMeta.$type);
    if (this.metas[metaName]) throw new Error(`meta "${metaName}" already exists`);

    this.metas[metaName] = anyMeta as MetaRaw;
    this.$.raw.metas[metaName] = anyMeta as MetaRaw;
    delete this._metas;

    return metaName;
  }

  @writeMethod
  async remove(this: Entity<NodeEntityImpl>, meta: string | any): Promise<boolean> {
    const name = typeof meta === 'object' ? meta.$.meta?.$name : this.nameByPath(meta);

    if (name && this.metas[name]) {
      delete this.metas[name];
      delete this.$.raw.metas[name];
      delete this._metas;

      return true;
    }

    return false;
  }
}
