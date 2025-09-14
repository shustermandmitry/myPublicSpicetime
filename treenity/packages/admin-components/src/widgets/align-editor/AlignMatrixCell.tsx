/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import useHover from '@/hooks/useHover';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import type {
  AlignCellsType,
  AlignDisplayType,
  AlignOrientationProps,
  IAlignIconProps,
  IAlignMatrixCell,
} from './types';

const row: AlignDisplayType = {
  center_start: 'top-row_outlined',
  left_start: 'top-row_outlined',
  right_start: 'top-row_outlined',
  left_center: 'center-row_outlined',
  center_center: 'center-row_outlined',
  right_center: 'center-row_outlined',
  center_end: 'bottom-row_outlined',
  left_end: 'bottom-row_outlined',
  right_end: 'bottom-row_outlined',
  'space-between_start': 'row-top-space-between_outlined',
  'space-between_center': 'row-center-space-between_outlined',
  'space-between_end': 'row-bottom-space-between_outlined',
  'space-between_stretch': 'space-between_outlined',
  'space-around_start': 'row-top-space-around_outlined',
  'space-around_center': 'row-center-space-around_outlined',
  'space-around_end': 'row-bottom-space-around_outlined',
  'space-around_stretch': 'space-around_outlined',
  center_stretch: 'stretch-horizontal_outlined',
  left_stretch: 'stretch-horizontal_outlined',
  right_stretch: 'stretch-horizontal_outlined',
};

const GeneralAlignIcons: AlignDisplayType = {
  left_start: 'left-column_outlined',
  center_center: 'center-column_outlined',
  right_end: 'right-column_outlined',
  'space-between_start': 'column-bottom-space-between_outlined',
  'space-between_center': 'column-center-space-between_outlined',
  'space-between_end': 'column-top-space-between_outlined',
  'space-between_stretch': 'space-between-vertical_outlined',
  'space-around_start': 'column-bottom-space-around_outlined',
  'space-around_center': 'column-center-space-around_outlined',
  'space-around_end': 'column-top-space-around_outlined',
  'space-around_stretch': 'space-around-vertical_outlined',
  center_stretch: 'stretch-vertical_outlined',
  left_stretch: 'stretch-vertical_outlined',
  right_stretch: 'stretch-vertical_outlined',
};

export const alignIcons: IAlignIconProps = {
  grid: {
    column: {
      left_center: 'left-column_outlined',
      left_end: 'left-column_outlined',
      center_start: 'center-column_outlined',
      center_end: 'center-column_outlined',
      right_start: 'right-column_outlined',
      right_center: 'right-column_outlined',
      ...GeneralAlignIcons,
    },
    row,
  },
  flex: {
    column: {
      left_center: 'center-column_outlined',
      left_end: 'right-column_outlined',
      center_start: 'left-column_outlined',
      center_end: 'right-column_outlined',
      right_start: 'left-column_outlined',
      right_center: 'center-column_outlined',
      ...GeneralAlignIcons,
    },
    row,
  },
};

const MatrixPointIcon = <Icon name="matrix-point_outlined" color="gray700" />;

const AlignMatrixCell: FC<IAlignMatrixCell> = ({
  value,
  orientation,
  selected,
  cellsType,
  onClick,
  display,
}) => {
  const [refCell, hovered] = useHover();
  const iconName = alignIcons[display as keyof IAlignIconProps][orientation][value];

  return (
    <Cell
      ref={refCell}
      onClick={onClick}
      cellsType={cellsType}
      orientation={orientation}
      about={value}
    >
      {iconName &&
        (hovered || selected ? (
          <IconStyled
            name={iconName}
            color="primary"
            cellsType={cellsType}
            orientation={orientation}
          />
        ) : cellsType === 'full' ? (
          MatrixPointIcon
        ) : (
          cellsType === 'triple' && [MatrixPointIcon, MatrixPointIcon, MatrixPointIcon]
        ))}
    </Cell>
  );
};

const IconStyled = styled(Icon, omitProps('cellsType', 'orientation'))<{
  cellsType: AlignCellsType;
  orientation: AlignOrientationProps;
}>`

  && i {
    font-size: ${p =>
      (p.orientation === 'column' && p.cellsType === 'triple') || p.cellsType === 'single'
        ? 54
        : 18}px
`;

const Cell = styled('div', omitProps('cellsType', 'orientation'))<{
  cellsType: AlignCellsType;
  orientation: AlignOrientationProps;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${p => p.theme.colorBorder};

  ${p =>
    p.cellsType === 'triple' &&
    css`
      justify-content: space-around;
    `}

  ${p =>
    p.orientation === 'column' &&
    css`
      flex-direction: column;
    `};

  :where(i) {
    color: ${p => p.theme.colorPrimary};
  }
`;

export default AlignMatrixCell;
