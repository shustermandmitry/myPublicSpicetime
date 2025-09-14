/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { types, type Node } from '@treenity/core';
import { useCallback } from 'react';
import { Entity, VARIANT_PREFIX } from '@treenity/entity';
import { useEditor, Node as CraftNode } from '@craftjs/core';
import { v4 } from 'uuid';
import useSWRMetaCache from './use-swr-meta-cache';

export default function useWebEditor(node: Node) {
  const { query, actions } = useEditor();
  const getMetaFromCache = useSWRMetaCache(node);

  const removeComponentFromNode = useCallback(
    async (id: string) => {
      try {
        await node?.remove('$' + id);
      } catch (err) {
        throw new Error('Error removing meta', { cause: err });
      }
    },
    [node],
  );

  const getCloneTree = useCallback(
    async (idToClone: string) => {
      const tree = query.node(idToClone).toNodeTree();

      const newNodes: Record<string, CraftNode> = {};

      const changeNodeId = (node: CraftNode, newParentId?: string) => {
        const newNodeId = v4();
        const childNodes = node.data.nodes.map((childId: string) =>
          changeNodeId(tree.nodes[childId], newNodeId),
        );
        const linkedNodes = Object.keys(node.data.linkedNodes).reduce(
          (accum, id) => {
            const linkedNodeNewId = changeNodeId(tree.nodes[node.data.linkedNodes[id]], newNodeId);
            accum[id] = linkedNodeNewId;
            return accum;
          },
          {} as Record<string, string>,
        );

        const tmpNode = {
          ...node,
          id: newNodeId,
          data: {
            ...node.data,
            parent: newParentId || node.data.parent,
            nodes: childNodes,
            linkedNodes,
          },
        };

        const freshnode = query.parseFreshNode(tmpNode).toNode();
        newNodes[newNodeId] = freshnode;

        async function duplicateMeta(id: string) {
          const meta = getMetaFromCache(id);

          const clonedMeta: Record<string, unknown> = {};
          Object.entries(meta?.data.toJSON()).forEach(([key, value]) => {
            if (!(key.startsWith(VARIANT_PREFIX) || !key.startsWith('$'))) return;
            clonedMeta[key] = value;
          });

          // This might happen in case we are cloning a component that has craft.js nodes inside it that are not metas, might change in a future.
          if (!clonedMeta) {
            console.warn('Meta not found for cloned component ', node);
            return;
          }

          await addComponentToNode(node.data.name, newNodeId, {
            ...clonedMeta,
            ...node.data.props,
            id: newNodeId,
          });
        }

        duplicateMeta(node.id);
        return newNodeId;
      };

      const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);

      return {
        rootNodeId,
        nodes: newNodes,
      };
    },
    [getMetaFromCache],
  );

  const removeNodeTree = useCallback(
    async (id: string) => {
      Object.values(query.node(id).toNodeTree().nodes as Record<string, CraftNode>).forEach(
        async node => {
          await removeComponentFromNode(node.id);
        },
      );
      actions.delete(id);
    },
    [node, actions, query],
  );

  const cloneComponent = useCallback(
    async (id: string, indexToAdd?: number) => {
      const parent = query.node(id).get().data.parent;
      const parentNode = query.node(parent ?? 'ROOT').get();
      indexToAdd ??= parentNode.data.nodes.indexOf(id) + 1;
      const { rootNodeId, nodes } = await getCloneTree(id);
      actions.addNodeTree({ nodes, rootNodeId }, parent ?? 'ROOT', indexToAdd);
      actions.selectNode(rootNodeId);
    },
    [node, actions, query, getCloneTree],
  );

  const addComponentToNode = useCallback(
    async (type: string, id: string, props?: Record<string, any>) => {
      try {
        // @ts-ignore
        const defaults = types.entity.items.get(type)?.component();

        const defaultProps = Object.entries(defaults).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value)) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>,
        );

        const componentProps = {
          ...defaultProps,
          ...props,
        };

        return (await node?.add(type, componentProps, id)) as Entity<any>;
      } catch (err) {
        throw new Error(`Error adding meta ${id}`, { cause: err });
      }
    },
    [node],
  );

  return {
    cloneComponent,
    removeNodeTree,
    addComponentToNode,
    removeComponentFromNode,
  };
}
