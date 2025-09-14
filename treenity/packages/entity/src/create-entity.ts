import { Meta, MetaName, metaType, types } from '@treenity/core';
import { Obj, Raw, splitObject } from '@treenity/js-shared/utils';
import { applyPatch, Operation } from 'fast-json-patch';
import { _getGlobalState, makeObservable } from 'mobx';
import { Entity, EntityActions, EntityMeta } from './entity';
import {
  extractVariants,
  VARIANT_PREFIX,
  formatVariants,
  addVariantOverride,
  removeVariantOverride,
  getVariant,
} from './variants';
import PatchManager from './patch-manager';

export const ENTITY_MARKER = Symbol('treenity.entity');

// so that we can override after
_getGlobalState().safeDescriptors = false;

function filterVariantPatches(raw: Raw<any> | Operation[]): Operation[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(patch => !patch.path.startsWith('/' + VARIANT_PREFIX));
}

export async function createEntity<T>(
  type: MetaName<T>,
  rawData: Obj,
  actions: Partial<EntityActions<T>>,
): Promise<Entity<T>> {
  const $type = metaType(type);
  if (process.env.NODE_ENV !== 'production') {
    if (!$type.isEqual(rawData.$type, false)) {
      console.warn(`Meta type mismatch: expected '${$type.$type}', got '${rawData.$type}'`);
    }
  }
  // try to find entity creator once
  const [factory, options] = await types.entity.get($type).catch(err => {
    if ($type.$context) {
      return types.entity.get($type.inContext('')).catch(err => {
        console.error('entity not found for', $type.$type, err);
        throw err;
      });
    }
    throw err;
  });

  const [$meta, obj = {}] = splitObject(rawData, key => (key[0] === '$' ? 0 : 1));
  rawData.$rev ??= 0;

  const entity = factory(obj, $meta, actions) as Entity<T>;

  const orig$onUpdate = entity.$onUpdate;

  function $onUpdate(this: Entity<T>, raw: Raw<T> | Operation[]) {
    this.$.rev++;
    if ((orig$onUpdate?.call(this, raw) as any) === false) return;

    // TODO: because on server we are writing overrides into the entity itself, we are getting a patch on a client.
    // on client we are storing entities in entity.$, so we need to filter out this patches.
    // need to think of a better solution for this.
    if (this.$.type.$context === 'client' && Array.isArray(raw)) {
      raw = filterVariantPatches(raw);
    }

    // patches
    if (Array.isArray(raw)) {
      applyPatch(this.$.raw, raw);
      applyPatch(this, raw);
    } else {
      Object.assign(this.$.raw, raw);
      Object.assign(this, raw);
    }

    return true;
  }

  async function $writePatch(this: Entity<T>, raw: Operation[]) {
    try {
      if (!raw.length) return;

      if (this.$.type.$context === 'server') {
        return await actions.patch?.(this, raw);
      }

      const patchManager = PatchManager.getInstance(this.$.id, async patches => {
        await actions.execute?.(this, '$writePatch', [patches]);
      });

      patchManager.addPatches(raw);
    } catch (error) {
      console.error('error patching in $writePatch', error);
    }
  }

  const val = (value: any) => ({ value, enumerable: false, writable: false });

  const entityInfo: EntityMeta<any> = {
    id: $meta.$id,
    meta: $meta as Meta<T>,
    raw: rawData as Meta<T> & Raw<T>,
    variants: extractVariants($meta),
    obj,
    get rev(): number {
      return this.raw.$rev;
    },
    set rev(value: number) {
      this.raw.$rev = value;
    },
    type: $type,
    actions,
    options,
    addVariantOverride: null!,
    removeVariantOverride: null!,
    getVariant: null!,
    manager: null!,
  };

  entityInfo.addVariantOverride = addVariantOverride.bind(entityInfo, entity);
  entityInfo.removeVariantOverride = removeVariantOverride.bind(entityInfo, entity);
  entityInfo.getVariant = getVariant.bind(entityInfo);

  Object.defineProperties(entity, {
    $: val(entityInfo),
    $id: val(entityInfo.id),
    toJSON: val(() => ({ ...entityInfo.raw, ...formatVariants(entityInfo.variants) })),
    $onUpdate: { value: $onUpdate, enumerable: false, configurable: true }, // configurable for mobx
    $writePatch: { value: $writePatch, enumerable: false, configurable: true },
    [ENTITY_MARKER]: val(true),
  });

  // optionally subscribe
  actions.subscribe?.(entity, patches => {
    entity.$onUpdate(patches);
  });
  entity.$onUpdate(obj as Raw<T>);

  makeObservable(
    entity,
    Object.fromEntries(
      Object.keys(entity)
        .filter(k => k[0] !== '_')
        .map(key => [key, true]),
    ) as any,
  );

  makeObservable(entityInfo, {
    variants: true,
    addVariantOverride: true,
    removeVariantOverride: true,
  });

  makeObservable(entity, {
    $onUpdate: true,
    $writePatch: true,
  });

  Object.defineProperties(entity, {
    $onUpdate: { enumerable: false },
    $writePatch: { enumerable: false },
  });

  actions.init?.(entity);

  return entity;
}

type GetC<T> = T;

export function getEntity<T>(entity: GetC<T>): Entity<GetC<T>> {
  if (!isEntity(entity)) throw new Error('Not an entity');
  return entity as Entity<GetC<T>>;
}

export function isEntity<T>(entity: T | Entity<T>): entity is Entity<T> {
  return !!(entity as any)[ENTITY_MARKER];
}
