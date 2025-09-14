/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { useLayout } from '@/context/LayoutContext';
import type { WithEditorProps } from '@/types';
import { Element, useEditor, useNode } from '@craftjs/core';

import { PropsWithChildren, useEffect, type FC } from 'react';

import { ColumnsEntity } from './columns.entity';
import type { ColumnsWidth } from './types';

export const Columns: FC<PropsWithChildren<WithEditorProps<{}, ColumnsEntity>>> = ({
  mergedMeta,
  value,
  style,
  children,
  className,
  ...props
}) => {
  const { id } = useNode();
  const { actions, query } = useEditor();

  useEffect(() => {
    const linkedNodeId = query.node(id).get().data.linkedNodes['columns-drop'];
    console.log('linkedNodeId', linkedNodeId);

    actions.setProp(linkedNodeId, props => (props.style = style));
  }, [style]);

  return (
    <div
      style={{
        padding: '24px',
        border: 'solid 1px blue',
      }}
    >
      {/* <Element is="div" style={{ display: 'flex' }} id="columns-drop" canvas></Element> */}
      <div>hh</div>
      {/* <pre>{JSON.stringify(style, null, 4)}</pre> */}
    </div>
  );
};

function getWidth(width: ColumnsWidth) {
  switch (width) {
    case 'auto':
      return 'auto';
    case '100%':
      return '100%';
    case 'min':
      return 'min-content';
    case 'max':
      return 'max-content';
  }
}
