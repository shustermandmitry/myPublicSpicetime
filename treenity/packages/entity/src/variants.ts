import { toJS } from 'mobx';
import { Operation } from 'fast-json-patch';
import { Raw } from '@treenity/js-shared/utils';
import { Entity, EntityMeta } from './entity';

export const VARIANT_PREFIX = '$:';

export function extractVariants<T>(meta: Record<string, T>) {
  return Object.entries(meta).reduce(
    (acc, [key, value]) => {
      if (key.startsWith(VARIANT_PREFIX)) {
        const variantKey = key.replace(VARIANT_PREFIX, '');
        acc[variantKey] = value;
      }
      return acc;
    },
    {} as Record<string, Partial<T>>,
  );
}

export function formatVariants(obj: Record<string, unknown>) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (key[0] === '_') {
        return acc;
      }
      acc[VARIANT_PREFIX + key] = toJS(value);
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function addVariantOverride<T>(
  this: EntityMeta<T>,
  entity: Entity<T>,
  variant: string,
  raw: Raw<Partial<T>>,
) {
  const patches: Operation[] = [];
  const overrides = this.variants;

  if (!overrides[variant]) {
    overrides[variant] = {};
    patches.push({
      op: 'add',
      path: `/$:${variant}`,
      value: {},
    });
  }

  Object.entries(raw).forEach(([key, value]) => {
    overrides[variant][key as keyof T] = value as T[keyof T];
    patches.push({
      op: 'add',
      path: `/$:${variant}/${key}`,
      value,
    });
  });

  return entity.$writePatch(patches);
}

export function getVariant<T>(this: EntityMeta<T>, variant: string) {
  const overrides = this.variants;
  return variant in overrides ? overrides[variant] : undefined;
}

export function removeVariantOverride<T>(
  this: EntityMeta<T>,
  entity: Entity<T>,
  variant: string,
  key: string,
) {
  const overrides = this.variants;
  if (variant in overrides && key in overrides[variant]) {
    const patches: Operation[] = [
      {
        op: 'remove',
        path: `/$:${variant}/${key}`,
      },
    ];

    delete overrides[variant][key as keyof T];

    return entity.$writePatch(patches);
  }
}
