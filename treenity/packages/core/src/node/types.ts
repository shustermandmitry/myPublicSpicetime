import { Raw } from '@treenity/js-shared/utils';
import { CallChain } from '@treenity/call-chain';
import { Meta, MetaRaw } from '../meta';
import { MetaName, MetaPath } from '../meta-type';

export interface NodeRef {
  ref: string; // local json-pointer, like #meta-id/freq
  url: string; // remote url, like tree:settings/scheduler/freq
}

export interface NodeData {
  /**
   * if ref exists in $refs, then field value will be replaced with value pointed by NodeRef.url
   */
  /**
   * @deprecated
   */
  path: string;
  url: string;
  default?: string; // default meta
  refs: NodeRef[];
  metas: { [name: string]: MetaRaw };
}

export type NodeRaw = Meta<NodeData>;

export interface Node extends NodeData {
  // isLoaded: boolean;
  // load(): Promise<Node>;
  // child: NodeProxy;
  allRaw(): MetaRaw[];
  raw<T>(type: MetaName<T>, path?: MetaPath): T | undefined;
  get<T>(type: MetaName<T>, path?: MetaPath): Promise<T>;
  /**
   * use `$get(metaName, name)` instead of `get()` to get promise with type definitions, for now it is
   * the limitations of TS lang.
   */
  $$: CallChain<Node>;

  add<T>(type: MetaName<T>, meta: Raw<T>, name?: string): Promise<T>;
  remove(meta: string | any): Promise<boolean>;
}
