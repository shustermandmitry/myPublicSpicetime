import Button from '@/components/button';
import Icon from '@/components/icon';
import InputNumber from '@/components/input-number';
import Segmented from '@/components/Segmented';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import React, { FC } from 'react';
import GridChildPosition from './GridChildPosition';
import { alignSelfOptions, justifySelfOptions } from './lists';
import type { AlignmentType, GridChildEditorProps, IGridChildEditorValue } from './types';

export const defaultGridChild: IGridChildEditorValue = {
  position: {},
  align: 'auto',
  justify: 'auto',
};

const GridChildEditor: FC<GridChildEditorProps> = ({ value, onChange, areas }) => {
  const [showAdvancedOptions, toggleAdvancedOptions] = useToggle();

  const handleChange = <K extends keyof IGridChildEditorValue>(
    name: K,
    newValue: IGridChildEditorValue[K],
  ) => {
    const updatedValue = {
      ...value,
      [name]: newValue,
    } as IGridChildEditorValue;

    onChange?.(updatedValue);
  };

  return (
    <Root>
      <GridChildPosition
        onChange={value => handleChange('position', value)}
        value={value?.position}
        areas={areas}
      />
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
          <PanelItem width={120} align="center" label="Align self">
            <Segmented<AlignmentType>
              size="small"
              block
              options={alignSelfOptions}
              onChange={(value: AlignmentType) => handleChange('align', value)}
              value={value?.align}
            />
          </PanelItem>
          <PanelItem width={120} align="center" label="Justify self">
            <Segmented<AlignmentType>
              size="small"
              block
              options={justifySelfOptions}
              onChange={(value: AlignmentType) => handleChange('justify', value)}
              value={value?.justify}
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

export default GridChildEditor;
