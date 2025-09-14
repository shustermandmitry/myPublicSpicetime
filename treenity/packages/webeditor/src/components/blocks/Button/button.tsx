/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Copyright (c) 2024. Treenity Inc.
 */

import useCurrentScreenSize from '@/hooks/use-current-screen-size';
import type { WithEditorProps } from '@/types';

import { Button as AntdButton } from 'antd';
import { FC } from 'react';
import { EditorComponent } from '../shared/EditorComponent';
import { ButtonEntity } from './button.entity';

import type { ButtonProps } from './types';

export const ButtonEdit: FC<WithEditorProps<ButtonProps, ButtonEntity>> = ({
  mergedMeta: { label, ...meta },
  value,
  style,
}) => {
  const screenSize = useCurrentScreenSize();

  return (
    <AntdButton style={style}>
      <EditorComponent
        onChange={t => value.$.addVariantOverride(screenSize, { label: t })}
        isEditMode={true}
      >
        {label}
      </EditorComponent>
    </AntdButton>
  );
};

export const ButtonRender: FC<WithEditorProps<ButtonProps, ButtonEntity>> = ({
  mergedMeta: { label, ...meta },
  style,
  id,
  value,
}) => {
  return <AntdButton style={style}>{label}</AntdButton>;
};

ButtonEdit.displayName = 'UI.Button.Edit';
