import type { ITreeItem } from '@/types';
import { SerializedNode, SerializedNodes } from '@craftjs/core';

export const constructTree = (
  data: SerializedNodes,
  nodeEnhancer?: (nodeId: string) => Record<string, unknown>,
) => {
  const createTreeStructure = (nodeId: string, path: string = '', index: number): ITreeItem => {
    const node = data[nodeId];

    // Handle regular nodes
    const regularChildren =
      node.nodes?.map((childId, childIndex) =>
        createTreeStructure(childId, `${path}${path ? '-' : ''}${childIndex}`, childIndex),
      ) || [];

    // Handle linked nodes as additional children
    const linkedChildren = Object.entries(node.linkedNodes).map(
      ([key, linkedNodeId], linkedIndex) =>
        createTreeStructure(
          linkedNodeId,
          `${path}${path ? '-' : ''}${regularChildren.length + linkedIndex}`,
          regularChildren.length + linkedIndex,
        ),
    );

    const baseNode = {
      index,
      zoneKey: node.parent || 'ROOT',
      title: typeof node.type === 'string' ? node.type : node.type.resolvedName || 'Unknown',
      props: node.props || {},
      key: nodeId,
      path: `${path}`,
      children: [...regularChildren, ...linkedChildren],
    };

    return nodeEnhancer ? { ...baseNode, ...nodeEnhancer(nodeId) } : baseNode;
  };

  const rootNodes = Object.entries(data)
    .filter(([_, node]) => node.parent === null)
    .map(([nodeId], index) => createTreeStructure(nodeId, `${index}`, index));

  return rootNodes;
};

export const getParentIdsFromTree = (tree: ITreeItem[], itemId: string): string[] | null => {
  const parentIDs: string[] = [];

  const searchTree = (node: ITreeItem, targetId: string): boolean => {
    if (node.key === targetId) {
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (searchTree(child, targetId)) {
          parentIDs.unshift(node.key.toString());
          return true;
        }
      }
    }

    return false;
  };

  for (const node of tree) {
    if (searchTree(node, itemId)) {
      return parentIDs;
    }
  }

  return null;
};
