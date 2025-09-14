import { PanelItem, PanelItemProps } from '@treenity/admin-components/widgets';
import type { PropsWithChildren } from 'react';

export interface FieldWrapperProps extends PanelItemProps {}

export const FieldWrapper = ({ children, ...restProps }: PropsWithChildren<FieldWrapperProps>) => {
  return <PanelItem {...restProps}>{children}</PanelItem>;
};
