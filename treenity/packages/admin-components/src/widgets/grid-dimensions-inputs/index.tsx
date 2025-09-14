import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import React, { type FC } from 'react';
import InputNumber from '../../components/input-number';

type DualInputValueType = {
  column: number | null;
  row: number | null;
};

interface GridDimensionsInputsProps {
  onChange(value: DualInputValueType): void;
  value: DualInputValueType;
}

const GridDimensionsInputs: FC<GridDimensionsInputsProps> = ({ onChange, value }) => {
  const handleColumnsChange = (column: DualInputValueType['column']) => {
    const newValue = {
      column,
      row: value.row,
    };

    onChange?.(newValue);
  };

  const handleRowsChange = (row: DualInputValueType['row']) => {
    const newValue = {
      column: value.column,
      row,
    };

    onChange?.(newValue);
  };

  return (
    <Root>
      <div>
        <InputNumber
          size="x-small"
          value={value.column}
          onChange={value => handleColumnsChange(Number(value))}
        />
        <Description size={8} fontWeight={800}>
          COLUMNS
        </Description>
      </div>
      <div>
        <InputNumber
          size="x-small"
          value={value.row}
          onChange={value => handleRowsChange(Number(value))}
        />
        <Description size={8} fontWeight={800}>
          ROWS
        </Description>
      </div>
    </Root>
  );
};

const Description = styled(TextContent)`
  color: ${p => p.theme.colorGrayText};
  text-transform: uppercase;
  letter-spacing: -0.32px;
  text-align: center;
  line-height: 8px;
`;

const Root = styled.div`
  gap: 4px;
  display: flex;
  align-items: start;

  .ant-form-item {
    margin: 0;

    .ant-form-item-control-input {
      min-height: initial;
    }
  }
`;

export default GridDimensionsInputs;
