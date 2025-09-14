import type { CustomField } from '@/types/fields';
import type { ReactElement } from 'react';

export type TreenityCustomField<Value, FieldProps = unknown> = {
  type: 'custom';
  label?: string;
  render: (props: {
    field: CustomField & FieldProps;
    name: string;
    value: Value;
    onChange: (value: Value) => void;
    readOnly?: boolean;
  }) => ReactElement;
};
