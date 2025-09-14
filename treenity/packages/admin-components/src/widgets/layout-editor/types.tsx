/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { AlignOrientationProps, AlignVariation } from '../align-editor/types';
import { IGridSettingsValue } from '../grid-settings/types';

export type LayoutDisplayValueType = 'block' | 'flex' | 'grid' | 'none';
export type LayoutGapValueType = {
  column: string;
  row: string;
};

export type LayoutGridValueType = {
  column: number;
  row: number;
};

export type GridJustifyType =
  | 'center'
  | 'start'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'stretch';

export interface LayoutThemedValue {
  display: LayoutDisplayValueType;
  direction?: AlignOrientationProps;
  align?: AlignVariation;
  gap?: LayoutGapValueType;
  order?: string;
  gridSettings?: IGridSettingsValue;
  columns?: GridJustifyType;
  rows?: GridJustifyType;
}

export interface LayoutEditorProps {
  onChange?(value: LayoutThemedValue): void;
  value?: LayoutThemedValue;
}
