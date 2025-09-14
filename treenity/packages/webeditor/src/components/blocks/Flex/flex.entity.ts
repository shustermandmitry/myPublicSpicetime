/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { FlexProps, ImageType, ItemType } from './types';

export const FlexType = metaType<FlexEntity>('markup.flex');

@entity(FlexType)
export class FlexEntity {
  image: ImageType = {
    src: '',
    backgroundPosition: 'center',
    backgroundSize: '100%',
  };
  items: ItemType[] = [{ id: '1' }, { id: '2' }];
  styles: FlexProps['styles'] = {
    ...DEFAULT_STYLES,
    layout: {
      ...DEFAULT_STYLES.layout,
      display: 'flex',
      direction: 'row',
      align: 'left_start',
      gap: {
        column: '4px',
        row: '4px',
      },
    },
  };
}
