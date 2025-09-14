import { getTypeName, MetaName, Node, NodeRaw } from '@treenity/core';
import { Obj } from '@treenity/js-shared/utils';
import { ILink } from './link';

export function getMeta<T = any>(node: NodeRaw, path: ILink, name?: MetaName<T>): T {
  // node.$refs.find((ref: NodeRef) => ref.ref === path.meta);
  const metaName = path.meta || node.default || (name && getTypeName(name));
  return (metaName ? node.metas?.[metaName] : node) as T;
}

export function getMetaByType<T>(node: Node | any, type: MetaName<T>): T | undefined {
  if (typeof node?.raw === 'function') {
    return node.raw(type);
  }

  return node.metas
    ? (Object.values(node.metas as Obj[]).find((m: any) => m.$type === getTypeName(type)) as T)
    : undefined;
}
