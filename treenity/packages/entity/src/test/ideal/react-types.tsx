import { Node } from '@treenity/core';
import { Raw } from '@treenity/js-shared/utils';
import { FC } from 'react';

export type EC<E, T = {}> = FC<{ value: E; node: Node } & T>;
export type SEC<E, T = {}> = FC<Raw<E> & { value: E; node: Node } & T>;

export function spreadComponent<T extends {}>(Component: SEC<T>): EC<T> {
  return props => {
    const { value, ...rest } = props;
    return <Component {...value} {...props} />;
  };
}
