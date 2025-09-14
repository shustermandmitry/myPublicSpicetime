import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import React, { FC } from 'react';
import { Icon } from '../../components';
import Button from '../../components/button';
import InputNumber from '../../components/input-number';
import Segmented from '../../components/Segmented';
import { alignSelfOptions } from '../grid-children-editor/lists';
import { AlignmentType } from '../grid-children-editor/types';
import PanelItem from '../panel-item';
import FlexChildSizing, { defaultFlexChildSizing } from './FlexChildSizing';
import type { FlexChildProps, IFlexChildValue } from './types';

export const defaultFlexChild: IFlexChildValue = {
  sizing: defaultFlexChildSizing,
  align: 'auto',
  order: 0,
};

const FlexChild: FC<FlexChildProps> = ({ value, onChange }) => {
  const [showAdvancedOptions, toggleAdvancedOptions] = useToggle();

  const handleChange = <K extends keyof IFlexChildValue>(name: K, newValue: IFlexChildValue[K]) => {
    const updatedValue = {
      ...value,
      [name]: newValue,
    } as IFlexChildValue;

    onChange?.(updatedValue);
  };

  return (
    <Root>
      <FlexChildSizing onChange={value => handleChange('sizing', value)} value={value?.sizing} />
      <Button
        size="x-small"
        type="secondary-outlined"
        suffix={<Icon name="arrow-bottom_outlined" rotate={showAdvancedOptions ? 180 : 0} />}
        onClick={toggleAdvancedOptions}
      >
        Advanced options
      </Button>
      {showAdvancedOptions && (
        <>
          <PanelItem label="Align self">
            <Segmented<AlignmentType>
              size="small"
              block
              options={alignSelfOptions}
              onChange={(value: AlignmentType) => handleChange('align', value)}
              value={value?.align}
            />
          </PanelItem>
          <PanelItem label="Order">
            <InputNumber
              type="number"
              size="x-small"
              placeholder="0"
              onChange={value => handleChange('order', value)}
              value={value?.order}
            />
          </PanelItem>
        </>
      )}
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default FlexChild;
