/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import React, { FC } from 'react';
import type { IFieldFormSettingsValue } from '../types';

interface FieldsFormItemProps {
  onEdit(): void;
  onRemove(): void;
  value: IFieldFormSettingsValue;
  index: number;
}

const FieldsFormItem: FC<FieldsFormItemProps> = ({ value, index, onEdit, onRemove }) => {
  return (
    <Root key={`${value.component}-${index}`}>
      <LeftSide>
        <ComponentName>{value.params.name}</ComponentName>
        <Name>{value.component}</Name>
      </LeftSide>
      <Buttons>
        <ButtonWithIcon size="x-small" icon={<Icon name="rename_outlined" />} onClick={onEdit} />
        <ButtonWithIcon
          danger
          size="x-small"
          icon={<Icon name="trash_outlined" />}
          onClick={onRemove}
        />
      </Buttons>
    </Root>
  );
};

const Buttons = styled.div`
  display: flex;
  align-items: center;

  button {
    border: none;

    & > div {
      display: none;
    }

    i {
      font-size: 12px;
    }
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  border-radius: 10px;
  background: ${p => p.theme.base400};
  color: ${p => p.theme.colorGrayText};
  font-size: 8px;
  font-weight: 800;
  letter-spacing: -0.16px;
  display: flex;
  align-items: center;
  padding: 4px;
`;

const ComponentName = styled.span`
  width: 64px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: -0.2px;
  display: block;
`;

const Root = styled.div`
  border-radius: 6px;
  border: 1px solid ${p => p.theme.gray400};
  background: ${p => p.theme.colorBgContainer};
  display: flex;
  padding-left: 5px;
  padding-right: 2px;
  justify-content: space-between;
`;

export default FieldsFormItem;
