import { FieldWrapper, type FieldWrapperProps } from '@/components/fields/shared/wrapper';

import { Input } from '@treenity/admin-components/components';
import type { InputProps } from 'antd';
import type { PropsWithChildren } from 'react';

// @ts-ignore
interface TreenityPropsInputProps extends FieldWrapperProps, Exclude<InputProps, 'name'> {}

export const TreenityPropsInput = ({
  children,
  label,
  ...rest
}: PropsWithChildren<TreenityPropsInputProps>) => {
  return (
    <FieldWrapper label={label}>
      <Input {...rest} />
      {children}
    </FieldWrapper>
  );
};
