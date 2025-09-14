/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { RowsProps } from './types';

export const RowsType = metaType<RowsEntity>('markup.Rows');

@entity(RowsType)
export class RowsEntity {
  distribution: RowsProps['distribution'] = 'evenly';
  rows: RowsProps['Rows'] = '';
  width: RowsProps['width'] = 'auto';
  gap: RowsProps['gap'] = 4;

  items: RowsProps['items'] = [{ id: '1' }, { id: '2' }];

  styles: RowsProps['styles'] = {
    shadow: DEFAULT_STYLES.shadow,
    spacing: DEFAULT_STYLES.spacing,
  };
}
