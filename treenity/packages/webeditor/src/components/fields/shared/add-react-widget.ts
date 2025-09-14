import { types } from '@treenity/core';
import { RENDER_CONTEXT } from '@treenity/ui-kit';
import { FC } from 'react';

const addReactWidget = (typeName: string, Component: FC<any>): void => {
  // @ts-ignore
  return types.react.add(RENDER_CONTEXT.WIDGET, typeName, Component, {});
};

export default addReactWidget;
