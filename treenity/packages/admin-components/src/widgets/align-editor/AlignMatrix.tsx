/*
 * Copyright (c) 2024. Treenity Inc.
 */

import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC, useMemo } from 'react';
import AlignMatrixCell from './AlignMatrixCell';
import { AlignCellsType, AlignMatrixProps, AlignOrientationProps, AlignVariation } from './types';

export const getValue = (index: number, value?: AlignVariation) => {
  if (value) {
    return value.split('_')[index];
  }
  return null;
};

const cellsFull: AlignVariation[] = [
  'left_start',
  'center_start',
  'right_start',
  'left_center',
  'center_center',
  'right_center',
  'left_end',
  'center_end',
  'right_end',
];

const cellsFlexColumn: AlignVariation[] = [
  'left_start',
  'left_center',
  'left_end',
  'center_start',
  'center_center',
  'center_end',
  'right_start',
  'right_center',
  'right_end',
];

const AlignMatrix: FC<AlignMatrixProps> = ({
  value = 'left_start',
  orientation = 'row',
  onSelect,
  display,
}) => {
  const [firstValue, secondValue] = value.split('_');

  const cells: {
    full(): AlignVariation[];
    triple(value: string): AlignVariation[];
    single(value: string): AlignVariation[];
  } = useMemo(
    () => ({
      full: () => {
        if (display === 'flex' && orientation === 'column') {
          return cellsFlexColumn;
        } else {
          return cellsFull;
        }
      },
      triple: (value: string) =>
        value === 'stretch'
          ? ([`left_${value}`, `center_${value}`, `right_${value}`] as AlignVariation[])
          : ([`${value}_start`, `${value}_center`, `${value}_end`] as AlignVariation[]),
      single: (value: string) => [`${value}_stretch`] as AlignVariation[],
    }),
    [display, orientation],
  );

  const cellsType = useMemo(() => {
    if (value === 'space-around_stretch' || value === 'space-between_stretch') {
      return 'single';
    } else if (
      firstValue === 'space-between' ||
      firstValue === 'space-around' ||
      secondValue === 'stretch'
    ) {
      return 'triple';
    }
    return 'full';
  }, [value, firstValue, secondValue]);

  const valueIndex = useMemo(() => {
    if (firstValue !== 'space-between' && firstValue !== 'space-around') {
      if (secondValue === 'stretch') {
        return 1;
      }
    }
    return 0;
  }, [firstValue, secondValue]);

  return (
    <Root cellsType={cellsType} orientation={orientation}>
      {cells[cellsType](getValue(valueIndex, value) as string).map((cell, index) => (
        <AlignMatrixCell
          display={display}
          key={index}
          value={cell}
          orientation={orientation}
          selected={cell === value}
          cellsType={cellsType}
          onClick={() => onSelect(cell)}
        />
      ))}
    </Root>
  );
};

const Root = styled('div', omitProps('cellsType', 'orientation'))<{
  cellsType: AlignCellsType;
  orientation: AlignOrientationProps;
}>`
  width: 60px;
  height: 60px;
  display: grid;
  grid-template-columns: ${p =>
    p.cellsType === 'triple' && p.orientation === 'row' ? '1fr' : 'repeat(3, 1fr)'};
  grid-template-rows: ${p =>
    p.cellsType === 'triple' && p.orientation === 'column' ? '1fr' : 'repeat(3, 1fr)'};
  border: 1px solid ${p => p.theme.colorBorder};
  background-color: ${p => p.theme.colorBgContainer};
  border-radius: 6px;
  padding: 2px;
`;

export default AlignMatrix;
