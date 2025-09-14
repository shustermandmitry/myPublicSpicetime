/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { BgPositionThemedValue } from '@/widgets/background-position-editor/types';
import { GradientThemedValues } from '../gradient-editor';

export interface BgImageValue {
  key: string;
  name: string;
}

export interface BackgroundThemedValue {
  backgroundColor: string | null;
  backgroundSize: 'auto' | 'contain' | 'cover';
  backgroundImage?: BgImageValue;
  backgroundGradient?: GradientThemedValues;
  backgroundPosition?: BgPositionThemedValue;
}

export interface BackgroundThemedProps {
  onChange?(value: BackgroundThemedValue): void;
  value?: BackgroundThemedValue;
}
