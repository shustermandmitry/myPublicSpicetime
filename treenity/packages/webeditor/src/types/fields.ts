import { ReactNode } from 'react';

type Field = CustomField | ObjectField | ArrayField;

type FieldProps<T = unknown> = {
  field: Field;
  id: string;
  name: string;
} & T;

type FieldRenderer<T = unknown> = (props: FieldProps<T>) => ReactNode;

type BaseField = {
  label?: string;
};

type CustomField = {
  type: 'custom';
  render: FieldRenderer;
} & BaseField;

type ArrayField = {
  type: 'array';
  arrayFields: Record<string, Field>;
  defaultItemProps: Record<string, unknown>;
  render: FieldRenderer;
} & BaseField;

type ObjectField = {
  type: 'object';
  objectFields: Record<string, Field>;
  defaultProperties?: Record<string, unknown>;
} & BaseField;

type Option = {
  label: string;
  value: string | number | boolean;
};

type SelectField = {
  type: 'select';
  options: Option[];
  render: FieldRenderer<{ options: Option[] }>;
} & BaseField;

type ISelectIconField = {
  type: 'select';
  render: FieldRenderer;
} & BaseField;

type RadioField = {
  type: 'radio';
  options: Option[];
  render: FieldRenderer<{ options: Option[] }>;
} & BaseField;

export {
  ArrayField,
  ObjectField,
  CustomField,
  Field,
  SelectField,
  RadioField,
  FieldProps,
  ISelectIconField,
};
