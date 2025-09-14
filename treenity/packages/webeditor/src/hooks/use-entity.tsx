/*
 * Copyright (c) 2024. Treenity Inc.
 */
import type { InferEntityType } from '@/components/blocks/store';
import { useLayout } from '@/context/LayoutContext';

import createMetaMutateKey from '@/utils/create-meta-mutate-key';
import { getEntityOverrides, getEntityProps } from '@/utils/entity-props';
import { mergeNestedProps } from '@/utils/merge-responsive-props';
import type { MetaTypeImpl } from '@treenity/core';
import { AnyType } from '@treenity/core';

import { Entity } from '@treenity/entity';
import { computed } from 'mobx';
import { useCallback } from 'react';
import useSWRImmutable from 'swr/immutable';
import useCurrentScreenSize from './use-current-screen-size';
import useWebEditor from './use-web-editor';

/**
/**
 * A hook to fetch and manage Editor Entity data
 * @param id The ID of the Editor Entity
 * @param type The type of the Editor Entity
 * @returns An object containing the Editor Entity data and related functions
 */
export const useEntity = (
  id: string,
  type?: Readonly<MetaTypeImpl<any>> | string,
  initialProps?: Record<string, unknown>,
) => {
  const screen = useCurrentScreenSize();
  const { node, suspense } = useLayout();
  const { addComponentToNode } = useWebEditor(node);

  const { data: editorEntity, isLoading } = useSWRImmutable<Entity<any> | undefined>(
    node && id ? createMetaMutateKey(node, id) : null,
    async () => {
      try {
        return await node?.get(type || AnyType, '$' + id);
      } catch (err) {
        console.log(`Meta not found, creating meta for ${type} with id ${id}`);
        if (type) {
          const entity = (await addComponentToNode(
            type as unknown as string,
            id,
            initialProps || {},
          )) as Entity<any>;
          return entity;
        }
      }
    },
    { suspense },
  );

  const mergedMeta = computed(() => {
    const overrides = getEntityOverrides(editorEntity);
    const defaultProps = getEntityProps(editorEntity);
    return mergeNestedProps(defaultProps, overrides, screen);
  }).get();

  const addOverride = useCallback(
    (newMeta: Partial<{ [K in keyof InferEntityType<any>]: InferEntityType<any>[K] }>) =>
      editorEntity?.$.addVariantOverride(screen, newMeta),
    [editorEntity, screen],
  );

  return {
    entity: editorEntity,
    mergedMeta,
    addOverride,
    isLoading,
  };
};
