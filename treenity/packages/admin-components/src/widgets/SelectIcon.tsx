/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon/icon-component';
import iconNames from '@/components/icon/icon-component/icons-names';
import Select, { SelectStyledProps } from '@/components/select';
import styled from '@emotion/styled';
import React, { FC } from 'react';

interface SelectIconProps extends SelectStyledProps {}

const SelectIcon: FC<SelectIconProps> = ({ ...restProps }) => {
  const ICON_OPTIONS = iconNames.map((icon, index) => ({
    label: (
      <Label>
        <Icon name={icon} />
        <span>{icon.length > 13 ? `${icon.slice(0, 13)}...` : icon}</span>
      </Label>
    ),
    value: icon,
  }));

  return (
    <Select
      options={ICON_OPTIONS}
      {...restProps}
      placeholder="Select icon"
      style={{ width: '100%', maxWidth: '100%' }}
    />
  );
};

const Label = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    flex: 1;
  }

  i {
    font-size: 12px;
  }
`;

export default SelectIcon;
