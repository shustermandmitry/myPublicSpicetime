import { getFileFromStack } from '@treenity/js-shared/utils';
import Link from './link/link';
import { Typed } from './meta';

export function makeTypeId(type: string, context?: string) {
  return context ? `${context}:${type}` : type;
}

export class MetaTypeImpl<T> implements MetaType<T>, Typed {
  $type: string;
  $context: string;
  $item?: T;
  $loc: string = 'unknown';

  constructor(type: string, context: string) {
    this.$type = type;
    this.$context = context;
  }

  toJSON() {
    return {
      $$type: this.$type, // to distinguish from other entity, which has $type field
      $context: this.$context || undefined,
    };
  }

  get $id() {
    return makeTypeId(this.$type, this.$context);
  }

  get server(): MetaType<T> {
    return this.$context === 'server' ? this : this.inContext('server');
  }

  get client(): MetaType<T> {
    return this.$context === 'client' ? this : this.inContext('client');
  }

  get empty(): MetaType<T> {
    return !this.$context ? this : this.inContext('');
  }

  inContext<T1 = T>(this: MetaType<any>, context: string): MetaType<T1> {
    return metaType<T1>(this, context);
  }

  toString() {
    return `[${this.$id}]`;
  }

  isEqual(other: MetaName<any>, context?: string | boolean): boolean {
    // if context boolean – it indicates if we should count context while comparison
    if (typeof context === 'boolean') {
      other = metaType(other);
      return this.$type === other.$type && (!context || this.$context === other.$context);
    }

    other = metaType(other, context);
    return this.$type === other.$type && this.$context === other.$context;
  }
}

// type MetaType_<T> = Readonly<InstanceType<typeof MetaTypeImpl<T>>>;
export type MetaType<T> = {
  $type: string;
  $context: string;
  $item?: T;
  $loc: string;

  toJSON(): any;

  $id: string;

  server: MetaType<T>;

  client: MetaType<T>;

  empty: MetaType<T>;

  inContext<T1 = T>(this: MetaType<any>, context: string): MetaType<T1>;

  toString(): string;

  isEqual(other: MetaName<any>, context?: string | boolean): boolean;
};

export type MetaName<T> = string | MetaType<T> | Clas<T>;

export type MetaPath = Link | string;

export type FromMetaType<T> = T extends MetaType<infer U> ? U : never;

export function pathToString(path: MetaPath): string {
  return typeof path === 'string' ? path : path.toString();
}

type Clas<T, A extends any[] = any[]> = { new (...args: A): T };

export function getTypeFromClass(clas: Clas<any>): MetaType<any> | undefined {
  return (clas as any)[(Symbol as any).metadata]?.type;
}

export function getTypeName(metaName: MetaName<any>): string {
  const metaNameAny = metaName as any;
  return (
    (typeof metaName === 'string'
      ? metaName
      : metaNameAny.$type || metaNameAny.$$type || getTypeFromClass(metaNameAny)?.$type) ||
    throwError(`wrong type descriptor ${metaName}`)
  );
}

export function throwError(message: string): never {
  throw new Error(message);
}

export function metaType<T>(type: MetaName<T>, context?: string): MetaType<T>;
export function metaType<T>(
  type: MetaName<T extends Clas<any> ? InstanceType<T> : T>,
  cls?: T extends Clas<any> ? T : string,
): MetaType<T extends Clas<any> ? InstanceType<T> : T>;
export function metaType<T>(type: MetaName<T>, subContext?: string): MetaType<T> {
  if (!type) throw new Error('type is required');
  const _subContext: string =
    subContext ??
    (typeof type === 'string'
      ? ''
      : '$context' in type
        ? type.$context
        : getTypeFromClass(type)?.$context) ??
    '';
  type = getTypeName(type);

  const metaType = _metaTypes[makeTypeId(type, _subContext)];
  if (metaType) return metaType;

  const newType = new MetaTypeImpl<T>(type, _subContext);
  newType.$loc = getFileFromStack(4)!;

  _metaTypes[makeTypeId(type, subContext)] = Object.freeze(newType);

  return newType;
}

/**
 * Any type equals to any other type and has no context
 */
export class AnyTypeImpl extends MetaTypeImpl<any> {
  constructor() {
    super('any', '');
  }

  isEqual(other: MetaName<any>, context?: string | boolean): boolean {
    return true;
  }

  inContext<T1 = any>(context: string): MetaType<any> {
    return this as MetaType<any>;
  }
}

const _metaTypes: Record<string, Readonly<MetaType<any>>> = {
  any: new AnyTypeImpl(),
};

export const AnyType = metaType<any>('any');
