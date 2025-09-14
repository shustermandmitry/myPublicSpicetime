import createMetaMutateKey from '@/utils/create-meta-mutate-key';
import type { Meta, Node } from '@treenity/core';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { Entity } from '@treenity/entity';

const isLayout = (meta: Meta) => meta.$tg?.includes('layout');

export async function initializeEntities(node: Node) {
  return await Promise.all(
    (node.allRaw() as Entity<any>[]).map(async meta => {
      if (isLayout(meta)) return;
      const id = meta.$name;
      if (id) {
        const entity = (await node.get(meta.$type, '$' + id)) as Entity<any>;
        await mutate(createMetaMutateKey(node, id), entity, {
          revalidate: false,
        });
      }
    }),
  );
}

export function useEntityInitialization(node?: Node) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!node || initialized) return;

    initializeEntities(node)
      .then(() => {
        setInitialized(true);
      })
      .catch(error => console.error('Error populating SWR cache:', error));
  }, [node, initialized]);

  return initialized;
}
