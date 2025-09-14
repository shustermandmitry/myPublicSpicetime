/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { IconNamesMap } from '@/components/icon/icon-component/types';

export type IFieldFormSettingsComponents =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'segmented'
  | 'checkbox'
  | 'switch'
  | 'textarea';

interface IFieldParamsDefault {
  id?: string;
  label: string;
  name: string;
  required?: boolean;
}

interface IFieldParamsInput extends IFieldParamsDefault {
  placeholder?: string;
  icon?: IconNamesMap;
  value?: string;
  maxLength?: number;
  minLength?: number;
}

interface IFieldParamsInputNumber extends IFieldParamsDefault {
  placeholder?: string;
  icon?: IconNamesMap;
  value?: number;
  max?: number;
  min?: number;
  step?: number;
}

interface IFieldParamsSelectOption {
  value: string;
  label: string;
}

interface IFieldParamsSelect extends IFieldParamsDefault {
  placeholder?: string;
  options?: IFieldParamsSelectOption[];
  icon?: IconNamesMap;
  value?: string;
}

interface IFieldParamsSegmentedOption {
  value: string;
  label: string;
}

interface IFieldFormSegmented extends IFieldParamsDefault {
  options: IFieldParamsSegmentedOption[];
  value?: string;
}

interface IFieldParamsCheckbox extends IFieldParamsDefault {
  checked?: boolean;
}

interface IFieldParamsSwitch extends IFieldParamsDefault {
  checked?: boolean;
}

interface IFieldParamsTextarea extends IFieldParamsDefault {
  placeholder?: string;
  icon?: IconNamesMap;
  value?: string;
  minRows?: number;
  maxRows?: number;
}

export interface IFieldFormSettingsValue {
  key: string;
  component: IFieldFormSettingsComponents;
  params:
    | IFieldParamsInput
    | IFieldParamsInputNumber
    | IFieldParamsSelect
    | IFieldFormSegmented
    | IFieldParamsCheckbox
    | IFieldParamsSwitch
    | IFieldParamsTextarea;
}

export interface FieldsFormSettingsProps {
  value: IFieldFormSettingsValue[];
  onChange(value: IFieldFormSettingsValue[]): void;
}

export type SettingsFormStateValuesType = 'default' | 'success' | 'error';
export type SettingsFormMethodValuesType = 'get' | 'post';

export interface IFormSettingsValues {
  state: SettingsFormStateValuesType;
  name: string;
  redirect: string;
  action: string;
  method: SettingsFormMethodValuesType;
  fields: IFieldFormSettingsValue[];
}

export interface FormSettingsProps {
  value: IFormSettingsValues;
  onChange(value: IFormSettingsValues): void;
}
