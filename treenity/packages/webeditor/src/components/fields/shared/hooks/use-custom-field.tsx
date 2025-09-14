import type { ScreenSize } from '@/constants';
import useCurrentScreenSize from '@/hooks/use-current-screen-size';
import { useEntity } from '@/hooks/use-entity';

import { useEditor } from '@craftjs/core';
import { useMemo, useState } from 'react';

interface IUseCustomFields<T> {
  name: string;
  value?: T;
  id?: string;
}

function isArrayKey(key: string): boolean {
  return /\[\d+\]/.test(key);
}

// Converts "menu[2].list" into ['menu', 2, 'list']
function parsePath(path: string): (string | number)[] {
  const pathArray: (string | number)[] = [];
  path.replace(/\[(\d+)\]|(\w+)/g, (match, index, prop) => {
    pathArray.push(index !== undefined ? Number(index) : prop);
    return match;
  });
  return pathArray;
}

function getUpdatedProperty(meta: Record<string, any>, path: string, value: any) {
  const pathParts = parsePath(path);
  const topLevelProp = pathParts[0];
  const newTopLevelValue = updateAtPath(meta[topLevelProp], pathParts.slice(1), value);
  return { prop: topLevelProp, value: newTopLevelValue };
}

function getNestedProperty<T>(obj: Record<string, any>, path: string): T | undefined {
  const pathParts = parsePath(path);
  let result = obj;

  for (const part of pathParts) {
    if (result == null || typeof result !== 'object') {
      return undefined;
    }
    result = result[part];
  }

  return result as T;
}

function updateAtPath(current: any, pathParts: (string | number)[], value: any): any {
  if (pathParts.length === 0) {
    return value;
  }

  const [firstPart, ...restParts] = pathParts;

  if (typeof firstPart === 'number') {
    // If the current level is an array
    return [
      ...current.slice(0, firstPart),
      updateAtPath(current[firstPart], restParts, value),
      ...current.slice(firstPart + 1),
    ];
  } else {
    // If the current level is an object
    return {
      ...current,
      [firstPart]: updateAtPath(current[firstPart], restParts, value),
    };
  }
}

export const useCustomField = <T,>({
  name,
  value,
  id,
}: IUseCustomFields<T>): {
  entity: ReturnType<typeof useEntity>['entity'];
  localValue: T;
  handleChange: (value: Partial<T>, key?: string) => void;
  hasOverrideValue: boolean;
  handleRemoveOverwrite: () => void;
  inheritedFrom: undefined | ScreenSize;
  updateEntity: (newValue: any) => void;
} => {
  const [inheritedFrom] = useState<undefined | ScreenSize>(undefined);
  const screenSize = useCurrentScreenSize();

  const { selectedItemId } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      selectedItemId: currentlySelectedNodeId,
    };
  });

  const itemId = id ?? selectedItemId;

  const { addOverride, entity, mergedMeta } = useEntity(itemId);

  const screen = useCurrentScreenSize();

  const hasOverrideValue = Boolean(entity?.$.getVariant(screen)?.[name as keyof typeof entity]);

  const localValue = useMemo(() => {
    return getNestedProperty<T>(mergedMeta ?? {}, name) as T;
  }, [mergedMeta, name]);

  const handleChange = (newValue: any, key?: string) => {
    if (isArrayKey(name)) {
      return updateEntity(newValue);
    }
    entity.$.addVariantOverride(screenSize, { [key || name]: newValue });
  };

  const handleRemoveOverwrite = () =>
    entity?.$.removeVariantOverride(name as keyof typeof entity, screen);

  const updateEntity = (newValue: unknown) => {
    if (!entity) return;
    const { prop, value } = getUpdatedProperty(entity, name, newValue);
    const base = entity.toJSON();

    const patches = [];
    if (value !== base[prop]) {
      entity[prop] = value;
      patches.push({
        op: 'replace',
        path: `/${prop}`,
        value: value,
      });
    }

    if (patches.length) {
      entity.$writePatch(patches);
    }
  };

  return {
    entity,
    handleRemoveOverwrite,
    localValue,
    handleChange,
    hasOverrideValue,
    inheritedFrom,
    updateEntity,
  };
};
