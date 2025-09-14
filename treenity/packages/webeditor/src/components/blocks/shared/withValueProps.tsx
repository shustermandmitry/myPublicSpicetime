import type { IReactContextProps, Meta } from '@treenity/core';
import { Entity, ENTITY_MARKER } from '@treenity/entity';
import * as React from 'react';

const isEntity = (value: Record<string, unknown> | Entity<any>): value is Entity<any> =>
  typeof value === 'object' && ENTITY_MARKER in value;

/**
 * This is a temporary HOC that is currently used for checking what value are we passing to the component.
 * @param Component - The component to be wrapped.
 */
export const withValueProps =
  <T extends Meta>(Component: React.FC<IReactContextProps<T, any>>) =>
  ({ value, ...props }: { value: T }) => {
    // Basically we are checking if the value is entity then we are passing it as a value, else we just spread them as props
    // TODO: will be removed later, when we will start passing entities to all components
    return <Component {...(isEntity(value) ? { value } : value)} {...props} />;
  };
