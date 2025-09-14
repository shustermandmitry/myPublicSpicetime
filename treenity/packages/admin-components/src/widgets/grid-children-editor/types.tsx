import type { IGridSettingsArea } from '@/widgets/grid-settings/types';
import React from 'react';

export type GridChildPositionType = keyof IGridChildPositionOptions;
type InputNumberValueType = number | string | null;
export type AlignmentType = 'auto' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export interface IGridChildPositionAuto {
  columns_span?: InputNumberValueType;
  rows_span?: InputNumberValueType;
}
export interface IGridChildPositionManual {
  column_start?: InputNumberValueType;
  column_end?: InputNumberValueType;
  row_start?: InputNumberValueType;
  row_end?: InputNumberValueType;
}
export interface IGridChildPositionOptions {
  area?: IGridSettingsArea;
  auto?: IGridChildPositionAuto;
  manual?: IGridChildPositionManual;
}

export interface IGridChildPositionOptionsList {
  label: string;
  disabled?: boolean;
  value: GridChildPositionType;
}

export interface IGridChildAlignmentOptions {
  icon: React.ReactNode;
  value: AlignmentType;
}

export interface IGridChildEditorValue {
  position: IGridChildPositionOptions;
  align: AlignmentType;
  justify: AlignmentType;
  order?: InputNumberValueType;
}

interface IGridChildAreasProps {
  areas?: IGridSettingsArea[];
}

export interface GridChildEditorProps extends IGridChildAreasProps {
  value?: IGridChildEditorValue;
  onChange?(value: IGridChildEditorValue): void;
}

export interface GridChildPositionProps extends IGridChildAreasProps {
  value?: IGridChildPositionOptions;
  onChange(value: IGridChildPositionOptions): void;
}
