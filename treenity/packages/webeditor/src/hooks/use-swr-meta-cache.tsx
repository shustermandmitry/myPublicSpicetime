import { unstable_serialize } from 'swr';
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

import { Node } from '@treenity/core';

import createMetaMutateKey from '@/utils/create-meta-mutate-key';

const useSWRMetaCache = (node: Node) => {
  const { cache } = useSWRConfig();

  return useCallback(
    (id: string) => cache.get(unstable_serialize(createMetaMutateKey(node, id))),
    [cache, node],
  );
};

export default useSWRMetaCache;
