// @ts-nocheck
/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { Entity } from '@treenity/entity';
import type { TreeNode } from '@treenity/tree-api';

const isUiMeta = <T extends { $name: string }>(meta: T) => {
  const name = typeof meta === 'object' ? meta?.$name : meta;
  return name?.startsWith('ui');
};

async function removeUnusedMeta(node: Entity<TreeNode>, componentIds: string[]) {
  const metasToRemove = node
    ?.allRaw()
    .map(meta => {
      if (!meta.$name) return undefined;
      if (!componentIds.includes(meta.$name) && isUiMeta(meta)) return meta.$name;
    })
    .filter(Boolean);

  try {
    await Promise.all(
      metasToRemove.map(meta =>
        node
          .remove('$' + meta)
          .then(() => {
            console.log(meta, ' removed');
          })
          .catch(err => console.error(`Failed to removed meta ${meta}:`, err)),
      ),
    );
  } catch (err) {
    console.error('An error occured during meta removal: ', err);
  }
}
