import type { IconNamesMap } from '@/components/icon/icon-component/types';
import { ReactNode } from 'react';
import type { LayoutDisplayValueType } from '../layout-editor/types';

export type AlignCellsType = 'triple' | 'single' | 'full';
export type AlignOrientationProps = 'row' | 'column';
export type AlignDisplayType = Partial<Record<AlignVariation, IconNamesMap>>;

export interface IAlignMatrixCell {
  value: AlignVariation;
  orientation: AlignOrientationProps;
  selected?: boolean;
  cellsType: AlignCellsType;
  display: LayoutDisplayValueType;
  onClick(): void;
}

export type AlignOrientationType = {
  column: AlignDisplayType;
  row: AlignDisplayType;
};

export interface IAlignIconProps {
  grid: AlignOrientationType;
  flex: AlignOrientationType;
}

export interface IListAlignItem {
  label: ReactNode;
  value?: string;
}

export interface AlignThemedProps {
  value?: AlignVariation;
  orientation: AlignOrientationProps;
  display: LayoutDisplayValueType;
  onChange(value: AlignVariation): void;
}

export type AlignVariation =
  | 'left_start'
  | 'center_start'
  | 'right_start'
  | 'left_center'
  | 'center_center'
  | 'right_center'
  | 'left_end'
  | 'center_end'
  | 'right_end'
  | 'space-between_start'
  | 'space-between_center'
  | 'space-between_end'
  | 'space-around_start'
  | 'space-around_center'
  | 'space-around_end'
  | 'space-between_stretch'
  | 'space-around_stretch'
  | 'center_stretch'
  | 'left_stretch'
  | 'right_stretch';

export interface AlignMatrixProps {
  value?: AlignVariation;
  orientation?: AlignOrientationProps;
  display: LayoutDisplayValueType;
  onSelect(value: AlignVariation): void;
}
