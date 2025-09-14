/*
 * Copyright (c) 2025. Treenity Inc.
 */

import { ScreenSize, screenSizes } from '@/constants';
import { Entity } from '@treenity/entity';

export function getEntityOverrides<T = any>(entity: Entity<T>): Partial<Record<ScreenSize, any>> {
  const meta = entity?.$.variants;
  const screenOverrides: any = {};

  for (const key in meta) {
    if (screenSizes.includes(key as ScreenSize)) {
      screenOverrides[key as ScreenSize] = meta[key];
    }
  }

  return screenOverrides;
}

export function getEntityProps<T = any>(entity: Entity<T>) {
  const props: Partial<T> = {};
  for (const key of Object.getOwnPropertyNames(entity || {})) {
    if (key.startsWith('$') || typeof entity[key as keyof T] === 'function') continue;
    props[key as keyof T] = entity[key as keyof T];
  }
  return props;
}
