/*
 * Copyright (c) 2024. Treenity Inc.
 */

import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import { TextProps } from './types';

export const TextType = metaType<TextEntity>('ui.text');

@entity(TextType)
export class TextEntity {
  text: TextProps['text'] = '';
}
