/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import React from 'react';

export const optionsFlexMock = [
  {
    label: 'Block',
    value: 'block',
  },
  {
    label: 'Flex',
    value: 'flex',
  },
  {
    label: 'Grid',
    value: 'grid',
  },
  {
    label: 'None',
    value: 'none',
  },
];

export const optionsDirectionMock = [
  {
    value: 'row',
    icon: <Icon name="flex-rows_outlined" />,
  },
  {
    value: 'column',
    icon: <Icon name="flex-columns_outlined" />,
  },
];

export const optionsColumns = [
  {
    icon: <Icon name="columns-align-left_outlined" />,
    value: 'start',
  },
  {
    icon: <Icon name="columns-align-center_outlined" />,
    value: 'center',
  },
  {
    icon: <Icon name="columns-align-right_outlined" />,
    value: 'end',
  },
  {
    icon: <Icon name="columns-align-space-around_outlined" />,
    value: 'space-between',
  },
  {
    icon: <Icon name="columns-align-space-between_outlined" />,
    value: 'space-around',
  },
  {
    icon: <Icon name="columns-align-stretch_outlined" />,
    value: 'stretch',
  },
];

export const optionsRows = [
  {
    icon: <Icon name="columns-align-left_outlined" rotate={90} />,
    value: 'start',
  },
  {
    icon: <Icon name="columns-align-center_outlined" rotate={90} />,
    value: 'center',
  },
  {
    icon: <Icon name="columns-align-right_outlined" rotate={90} />,
    value: 'end',
  },
  {
    icon: <Icon name="columns-align-space-around_outlined" rotate={90} />,
    value: 'space-between',
  },
  {
    icon: <Icon name="columns-align-space-between_outlined" rotate={90} />,
    value: 'space-around',
  },
  {
    icon: <Icon name="columns-align-stretch_outlined" rotate={90} />,
    value: 'stretch',
  },
];
