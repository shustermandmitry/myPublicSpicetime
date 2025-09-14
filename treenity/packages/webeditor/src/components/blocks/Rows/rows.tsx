/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { useLayout } from '@/context/LayoutContext';
import type { WithEditorProps } from '@/types';
import { resolvePixelValue } from '@/utils/resolve-pixel-value';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { type FC, useMemo } from 'react';
import dropZoneFixStyles from '../shared/dropZoneFix.styles';
import type { RowsProps, RowsWidth } from './types';

const Item = styled('div', omitProps('alignSelf', 'span', 'id', 'shouldSpan', 'hasChild'))<
  RowsProps['items'][number] & { shouldSpan: boolean; hasChild: boolean }
>`
  align-self: ${({ alignSelf, hasChild }) => (hasChild ? alignSelf : 'auto')};
  justify-self: ${({ justifySelf, hasChild }) => (hasChild ? justifySelf : 'auto')};
  grid-row: ${({ span, shouldSpan }) => (shouldSpan ? `span ${span}` : 'auto')};

  &:has([class*='_DropZone--hasChildren_']) {
    width: auto;
  }
`;

export const Rows: FC<WithEditorProps<RowsProps>> = ({ id, renderItem, items, ...props }) => {
  const { layout } = useLayout();

  const zonesWithChildren = useMemo(
    () =>
      Object.entries(layout?.layout?.zones || {})
        .map(([key, value]) => {
          if (key.startsWith(id) && value.length > 0) {
            return key.split('item-')[1];
          }
        })
        .filter(Boolean),
    [layout.layout.zones],
  );

  return (
    <RowsRoot items={items} {...props}>
      {items?.map((item, idx) => {
        const hasChild = zonesWithChildren.includes(item.id);

        return (
          <Item
            key={item.id}
            hasChild={hasChild}
            shouldSpan={props.distribution === 'custom' && !props.Rows}
            {...item}
          >
            {renderItem(item)}
          </Item>
        );
      })}
    </RowsRoot>
  );
};

const RowsRoot = styled(
  'div',
  omitProps(
    'width',
    'justifyContent',
    'backgroundColor',
    'borderRadius',
    'RowsDirection',
    'alignItems',
    'image',
    'items',
    'customStyles',
    'spacing',
    'url',
    'styles',
  ),
)<Omit<RowsProps, 'renderItem' | 'styles'>>`
  width: ${({ width }) => getWidth(width)};
  display: grid;
  grid-template-rows: ${({ distribution, items, Rows }) =>
    Rows && distribution === 'custom'
      ? Rows
      : `repeat(${distribution === 'evenly' ? items.length : '12'}, 1fr)`};
  gap: ${({ gap }) => resolvePixelValue(gap || 4)};
  object-fit: cover;
  position: relative;
  height: 100%;
  ${dropZoneFixStyles}
`;

function getWidth(width: RowsWidth) {
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
