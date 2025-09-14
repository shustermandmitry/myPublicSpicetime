import { getSymbolField, Raw } from '@treenity/js-shared/utils';
import { MetaName } from './meta-type';

export interface WithId {
  $id: string;
}

export interface Typed {
  $type: string;
}

// using JSON Schema & JSON Pointer
export interface MetaRaw extends Typed, WithId {
  $name?: string;
  $anchor?: string; // short name in node, or in tree
  $perm?: MetaPermission;
  $tg?: string[];
  // [name: string]: any | null; // meta fields
}

export type Meta<T = any> = T & MetaRaw;

// Key is link to a method
// Value is array of allowed roles
export type MetaPermission = Record<string, Array<string>>;

//& NodeCallSignature;

export const MetaSymbolType = Symbol.for('$meta');

export function getMeta<T>(entity: T): Meta<T> {
  return getSymbolField(entity, MetaSymbolType);
}

export function getMetaRaw<T>(entity: T): Raw<T> {
  return (getSymbolField(entity, MetaSymbolType) as any).$raw as Raw<T>;
}

export function serializeMeta(meta: any): Record<string, any> {
  return typeof meta.toJSON === 'function' ? meta.toJSON() : JSON.parse(JSON.stringify(meta));
}
