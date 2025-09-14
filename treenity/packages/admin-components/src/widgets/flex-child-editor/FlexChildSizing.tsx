import InputNumber from '@/components/input-number';
import Segmented from '@/components/Segmented';
import InputWithUnits from '@/widgets/input-with-units';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { isEqual } from '@s-libs/micro-dash';
import React, { FC, useEffect, useState } from 'react';
import { flexSizingOptions } from './lists';
import type { FlexChildSizingProps, FlexChildSizingType, FlexChildSizingValue } from './types';

export const defaultFlexChildSizing: FlexChildSizingValue = {
  shrink: 0,
  grow: 1,
  basis: 'auto',
};

const shrinkValue = { shrink: 0, grow: 1, basis: 'auto' };
const growValue = { shrink: 1, grow: 1, basis: '0%' };
const noneValue = { shrink: 0, grow: 0, basis: 'auto' };

const FlexChildSizing: FC<FlexChildSizingProps> = ({ value, onChange }) => {
  const [selectValue, setSelectValue] = useState<FlexChildSizingType>('shrink');
  const handleChange = <K extends keyof FlexChildSizingValue>(
    name: K,
    newValue: FlexChildSizingValue[K],
  ) => {
    const updatedValue = {
      ...value,
      [name]: name === 'basis' && typeof newValue !== 'string' ? 'auto' : newValue,
    } as FlexChildSizingValue;

    onChange?.(updatedValue);
  };

  const handleChangeSelect = (newValue: FlexChildSizingType) => {
    switch (newValue) {
      case 'shrink':
        onChange?.(shrinkValue);
        return setSelectValue('shrink');
      case 'grow':
        onChange?.(growValue);
        return setSelectValue('grow');
      case 'none':
        onChange?.(noneValue);
        return setSelectValue('none');
      case 'customize':
        onChange?.(value || shrinkValue);
        return setSelectValue('customize');
    }
  };

  useEffect(() => {
    if (isEqual(value, shrinkValue) || !value) return setSelectValue('shrink');
    if (isEqual(value, growValue)) return setSelectValue('grow');
    if (isEqual(value, noneValue)) return setSelectValue('none');
    return setSelectValue('customize');
  }, []);

  return (
    <PanelItem label="Sizing">
      <Container>
        <Segmented<FlexChildSizingType>
          size="small"
          block
          options={flexSizingOptions}
          onChange={handleChangeSelect}
          value={selectValue}
        />
        {selectValue === 'customize' && (
          <Flex>
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.shrink}
              onChange={value => handleChange('shrink', value)}
            />
            <InputNumber
              size="x-small"
              placeholder="0"
              value={value?.grow}
              onChange={value => handleChange('grow', value)}
            />
            <InputWithUnits
              size="x-small"
              value={value?.basis}
              onChange={value => handleChange('basis', value)}
            />
            <span>grow</span>
            <span>shrink</span>
            <span>basic</span>
          </Flex>
        )}
      </Container>
    </PanelItem>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Flex = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr) 54px;
  column-gap: 4px;
  row-gap: 2px;

  & > span {
    color: ${p => p.theme.colorGrayText};
    text-align: center;
    font-size: 8px;
    font-weight: 800;
    line-height: 8px;
    letter-spacing: -0.32px;
    text-transform: uppercase;
  }
`;

export default FlexChildSizing;
