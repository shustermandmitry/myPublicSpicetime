/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { BackgroundThemedValue } from '@/widgets/background-editor/types';

export type BgPositionThemedPositionXValue = 'center' | 'left' | 'right';
export type BgPositionThemedPositionYValue = 'center' | 'top' | 'bottom';
export type BgPositionThemedRepeatValue = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';

export interface BgPositionThemedPositionValue {
  x: BgPositionThemedPositionXValue;
  y: BgPositionThemedPositionYValue;
}

export interface BgPositionThemedValue {
  positions: BgPositionThemedPositionValue;
  repeat: BgPositionThemedRepeatValue;
  image?: string;
}

export interface BgPositionThemedProps {
  value?: BgPositionThemedValue;
  imageStyle?: BackgroundThemedValue;
  onChange?(value: BgPositionThemedValue): void;
}
