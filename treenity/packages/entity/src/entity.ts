import { Meta, MetaName, MetaRaw, MetaType, metaType } from '@treenity/core';
import { CallChain } from '@treenity/call-chain';
import { isServer } from '@treenity/js-shared';
import { Raw } from '@treenity/js-shared/utils';
import '@treenity/json-schema';
import { applyPatch, Operation } from 'fast-json-patch';
export interface EntityActions<T = any> {
  init?(entity: T): void;
  /**
   * Apply patches to the remote entity
   */
  patch?(entity: T, patches: Operation[]): Promise<void>;

  /**
   * Call remote method on the original entity to apply changes
   * @param entity
   * @param method
   * @param args
   */
  execute?<R>(entity: T, method: string, args: any[]): Promise<R>;

  /**
   * Subscribe to entity changes
   * @param entity
   * @param cb - callback to call when entity changes
   * @returns function to call to cancel subscription
   */
  subscribe?(entity: T, cb: (patches: Operation[], cancel: () => void) => void): () => void;

  create?(data: Partial<MetaRaw & Raw<T>>): Promise<Raw<T>>;

  remove?(entity: T): Promise<void>;
}

/**
 * entity metadata, always exists on entities
 */
export interface EntityMeta<T, K extends string[] = []> {
  id: string;
  type: MetaType<T>;
  raw: Raw<T> & Meta<T> & { overrides?: K extends [] ? never : Record<K[number], Partial<T>> };
  meta: Meta<T>;
  obj: Raw<T>;
  rev: number;
  actions: EntityActions<T>;
  options: any;
  manager: IEntityManager;
  variants: Record<string, Partial<T>>;
  addVariantOverride: (variant: string, raw: Raw<Partial<T>>) => Promise<void>;
  removeVariantOverride: (variant: string, key: string) => Promise<void>;
  getVariant: (variant: string) => Partial<T> | undefined;
}

/**
 * Entity manager, creating, caching and links counting.
 */
export interface IEntityManager {
  get<T>(entityId: string, type?: MetaName<T>): Entity<T> | undefined;
  ensure<T>(data: any, actions: EntityActions<T>, type?: MetaName<T>): Promise<Entity<T>>;
}

export class EntityImpl<T> {
  $!: EntityMeta<T>;
  // $$!: CallChain<T>;

  constructor(raw?: Partial<Meta<Raw<T>>>) {
    if (raw) {
      Object.assign(this, raw);
    }
  }

  $onUpdate(patches: Operation[] | Raw<T>): any {}
  $writePatch(patches: Operation[] | Raw<T>): any {}

  patch(patches: Operation[]): void {
    if (isServer) {
      applyPatch(this, patches);
    }
  }
}

export type Entity<T> = EntityImpl<T> & T;

export const entityType: typeof metaType = metaType;
