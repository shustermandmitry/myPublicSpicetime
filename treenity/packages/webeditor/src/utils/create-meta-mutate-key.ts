import type { Node } from '@treenity/core';

function createMetaMutateKey(node: Node, id: string) {
  return ['meta', node.path || node.url, id];
}

export default createMetaMutateKey;
