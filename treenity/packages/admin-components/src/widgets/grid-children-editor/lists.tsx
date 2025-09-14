import Icon from '@/components/icon';
import React from 'react';
import { IGridChildAlignmentOptions, IGridChildPositionOptionsList } from './types';

export const positionOptions = (isDisableAreas: boolean): IGridChildPositionOptionsList[] => [
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Area',
    value: 'area',
    disabled: isDisableAreas,
  },
  {
    label: 'Manual',
    value: 'manual',
  },
];

export const justifySelfOptions: IGridChildAlignmentOptions[] = [
  {
    icon: <Icon name="close_outlined" />,
    value: 'auto',
  },
  {
    icon: <Icon name="justify-self-start_outlined" />,
    value: 'start',
  },
  {
    icon: <Icon name="justify-self-center_outlined" />,
    value: 'center',
  },
  {
    icon: <Icon name="justify-self-end_outlined" />,
    value: 'end',
  },
  {
    icon: <Icon name="justify-self-stretch_outlined" />,
    value: 'stretch',
  },
  {
    icon: <Icon name="justify-self-baseline_outlined" />,
    value: 'baseline',
  },
];

export const alignSelfOptions: IGridChildAlignmentOptions[] = [
  {
    icon: <Icon name="close_outlined" />,
    value: 'auto',
  },
  {
    icon: <Icon name="justify-self-start_outlined" rotate={90} />,
    value: 'start',
  },
  {
    icon: <Icon name="justify-self-center_outlined" rotate={90} />,
    value: 'center',
  },
  {
    icon: <Icon name="justify-self-end_outlined" rotate={90} />,
    value: 'end',
  },
  {
    icon: <Icon name="justify-self-stretch_outlined" rotate={90} />,
    value: 'stretch',
  },
  {
    icon: <Icon name="justify-self-baseline_outlined" rotate={-90} />,
    value: 'baseline',
  },
];
