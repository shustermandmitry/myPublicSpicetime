/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import SelectOption from '@/components/select/SelectOption';
import React from 'react';

export const optionsBorderRadius = [
  {
    value: 'no-repeat',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'repeat',
    icon: <Icon name="repeat_filled" />,
  },
  {
    value: 'repeat-y',
    icon: <Icon name="kebab-v_filled" />,
  },
  {
    value: 'repeat-x',
    icon: <Icon name="kebab_filled" />,
  },
];

export const BACKGROUND_POSITION_X = [
  {
    label: <SelectOption label="Left" icon="left-offset_outlined" />,
    value: 'left',
  },
  {
    label: <SelectOption label="Center" icon="center-offset_outlined" />,
    value: 'center',
  },
  {
    label: <SelectOption label="Right" icon="right-offset_outlined" />,
    value: 'right',
  },
];

export const BACKGROUND_POSITION_Y = [
  {
    label: <SelectOption label="Top" icon="top-offset_outlined" />,
    value: 'top',
  },
  {
    label: <SelectOption label="Center" icon="middle-offset_outlined" />,
    value: 'center',
  },
  {
    label: <SelectOption label="Bottom" icon="bottom-offset_outlined" />,
    value: 'bottom',
  },
];
