/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { RichEditorProps } from './types';

export const RichEditorType = metaType<RichEditorEntity>('basic.richEditor');

@entity(RichEditorType)
export class RichEditorEntity {
  /**
   * @widget treenity.empty
   */
  state: RichEditorProps['state'] = 'Get Started';
  styles: RichEditorProps['styles'] = {
    spacing: DEFAULT_STYLES.spacing,
  };
}
