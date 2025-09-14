export interface GridSettingsProps {
  onChange(value: IGridSettingsValue): void;
  onCancel(): void;
  value: IGridSettingsValue;
}

export interface IGridSettingsValue {
  columns: IGridSettingsValueCR[];
  rows: IGridSettingsValueCR[];
  areas?: IGridSettingsArea[];
}

export type GridSettingsCRType = 'fixed' | 'auto' | 'min-max';

export type GridSettingsCRSizeType = {
  min: string;
  max: string;
};

export interface IGridSettingsValueCR {
  format: GridSettingsCRType;
  size?: GridSettingsCRSizeType | string;
}

export interface IGridSettingsArea {
  columns_start: number;
  columns_end: number;
  rows_start: number;
  rows_end: number;
}
