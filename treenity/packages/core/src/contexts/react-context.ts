import { capitalize, Obj } from '@treenity/js-shared/utils';
import * as React from 'react';
import { Context, ContextImpl, TypeContextInfo } from '../context';
import { getTypeName } from '../meta-type';
import { Node } from '../node';

export interface ReactContextOptions {
  props?: Obj<any>;
  replace?: boolean;
  // ports?: PortsDescription;
}

export type IReactContextProps<T = any, P = {}, N extends Node = Node> = {
  value: T;
  node: N;

  onChange(setter: (m: T) => T | void): void;
} & P;
export type ReactTypeContextInfo = TypeContextInfo<
  React.FC<IReactContextProps>,
  ReactContextOptions
>;

export interface ReactTypeContext
  extends Context<React.FC<IReactContextProps>, ReactContextOptions> {}

export class ReactTypeContextImpl
  extends ContextImpl<React.FC<IReactContextProps>, ReactContextOptions>
  implements ReactTypeContext
{
  add(...args: any[]): ReactTypeContextInfo {
    if (args.length === 4) {
      const [, typeName, component] = args;
      if (!component.displayName && !component.name) {
        component.displayName = capitalize(getTypeName(typeName));
      }
    } else {
      const [typeName, component] = args;
      if (!component.displayName && !component.name) {
        component.displayName = capitalize(getTypeName(typeName));
      }
    }
    return super.add(...args);
  }
}
