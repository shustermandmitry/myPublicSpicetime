/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { ColumnsProps } from './types';

export const ColumnsType = metaType<ColumnsEntity>('markup.columns');

@entity(ColumnsType)
export class ColumnsEntity {
  distribution: ColumnsProps['distribution'] = 'evenly';
  columns: ColumnsProps['columns'] = '';
  rows: ColumnsProps['rows'] = '';
  width: ColumnsProps['width'] = 'auto';
  gap: ColumnsProps['gap'] = 4;
  items: ColumnsProps['items'] = [{}, {}];
  styles: ColumnsProps['styles'] = {
    ...DEFAULT_STYLES,
    // @ts-ignore
    layout: {
      display: 'flex',
      direction: 'row',
      align: 'center_center',
      gap: {
        column: '4px',
        row: '4px',
      },
    },
  };
}
