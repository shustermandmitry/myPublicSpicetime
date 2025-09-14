/*
 * Copyright (c) 2024. Treenity Inc.
 */
import SelectOption from '@/components/select/SelectOption';
import { IListAlignItem } from './types';

export const ListAlignHorizontal: IListAlignItem[] = [
  {
    label: <SelectOption label="Left" icon={'flex-align-left_outlined'} />,
    value: 'left',
  },
  {
    label: <SelectOption label="Center" icon={'flex-align-center_outlined'} />,
    value: 'center',
  },
  {
    label: <SelectOption label="Right" icon={'flex-align-right_outlined'} />,
    value: 'right',
  },
  {
    label: <SelectOption label="Space between" icon={'flex-space-between_outlined'} />,
    value: 'space-between',
  },
  {
    label: <SelectOption label="Space around" icon={'flex-space-around_outlined'} />,
    value: 'space-around',
  },
];

export const ListAlignVertical: IListAlignItem[] = [
  {
    label: <SelectOption label="Start" icon={'flex-align-top_outlined'} />,
    value: 'start',
  },
  {
    label: <SelectOption label="Center" icon={'flex-align-center-h_outlined'} />,
    value: 'center',
  },
  {
    label: <SelectOption label="End" icon={'flex-align-bottom_outlined'} />,
    value: 'end',
  },
  {
    label: <SelectOption label="Stretch" icon={'flex-align-stretch_outlined'} />,
    value: 'stretch',
  },
];
