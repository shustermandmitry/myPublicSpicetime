import { metaType } from '@treenity/core';
import type { TreenityInterface } from '@treenity/feathers-service';
import { TreeNode } from '@treenity/tree-api';

export const TreeServiceType = metaType<
  TreenityInterface<TreeNode> & {
    execute: (params: { service: string; id: string; method: string; args: any[] }) => any;
  }
>('sys.tree-fs-service');
