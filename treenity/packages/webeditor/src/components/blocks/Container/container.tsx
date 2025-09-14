/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { WithEditorProps } from '@/types';

import type { FC, PropsWithChildren } from 'react';
import { ContainerEntity } from './container.entity';

import type { ContainerProps } from './types';

export const Container: FC<PropsWithChildren<WithEditorProps<ContainerProps, ContainerEntity>>> = ({
  children,
  mergedMeta,
  style,
  value,
  ...props
}) => {
  return <div style={style}>{children}</div>;
};

Container.displayName = 'Container';
