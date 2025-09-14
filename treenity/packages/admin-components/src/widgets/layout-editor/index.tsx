/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Icon } from '@/components';
import Button from '@/components/button';
import Input from '@/components/input';
import Segmented from '@/components/Segmented';
import AlignThemed from '@/widgets/align-editor';
import DualInput from '@/widgets/DualInput';
import GridSettings, { gridSettingsDefaultValue } from '@/widgets/grid-settings';
import InputWithUnits, { InputWithUnitsProps } from '@/widgets/input-with-units';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { Popover } from 'antd';
import { FC, memo } from 'react';
import type { AlignOrientationProps, AlignVariation } from '../align-editor/types';
import GridDimensionsInputs from '../grid-dimensions-inputs';
import { IGridSettingsValue } from '../grid-settings/types';
import PanelItem from '../panel-item';
import { optionsColumns, optionsDirectionMock, optionsFlexMock, optionsRows } from './list';
import {
  GridJustifyType,
  LayoutDisplayValueType,
  LayoutEditorProps,
  LayoutGapValueType,
  LayoutGridValueType,
  LayoutThemedValue,
} from './types';

export const layoutDefaultValue: LayoutThemedValue = {
  display: 'block',
  direction: 'row',
  align: 'left_start',
  gridSettings: gridSettingsDefaultValue,
  gap: {
    column: '0px',
    row: '0px',
  },
  columns: 'start',
  rows: 'start',
  order: '0',
};

// Create separate components for inputs
const GapInputComponent = memo((props: InputWithUnitsProps) => {
  return <InputWithUnits {...props} isHideAuto={true} />;
});

const LayoutEditor: FC<LayoutEditorProps> = ({ value = layoutDefaultValue, onChange }) => {
  const [showGridSettings, setShowGridSettings] = useToggle();
  const [showAdvancedOptions, toggleAdvancedOptions] = useToggle();

  const handleChange = <K extends keyof LayoutThemedValue>(
    name: K,
    newValue: LayoutThemedValue[K],
  ) => {
    const updatedValue = {
      ...value,
      [name]: newValue,
    } as LayoutThemedValue;

    onChange?.(updatedValue);
  };

  const handleChangeGrid = (gridValue: LayoutGridValueType) => {
    const currentSettings: IGridSettingsValue = value.gridSettings || {
      columns: [{ format: 'fixed', size: '1fr' }],
      rows: [{ format: 'auto' }],
    };

    // Создаем полностью новый объект настроек
    const newGridSettings: IGridSettingsValue = {
      ...currentSettings,
      columns: Array.from(
        { length: gridValue.column },
        (_, index) =>
          currentSettings.columns?.[index] || {
            format: 'fixed',
            size: '1fr',
          },
      ),
      rows: Array.from(
        { length: gridValue.row },
        (_, index) =>
          currentSettings.rows?.[index] || {
            format: 'auto',
          },
      ),
    };

    handleChange('gridSettings', newGridSettings);
  };

  const gridValue = {
    row: value.gridSettings?.rows.length || 1,
    column: value.gridSettings?.columns.length || 1,
  };

  const isDisplayGrid = value.display === 'grid';
  const isDisplayFlex = value.display === 'flex';
  const isDisplayNone = value.display === 'none';

  return (
    <Root>
      <PanelItem label="Display">
        <Segmented
          size="small"
          block
          options={optionsFlexMock}
          value={value.display}
          onChange={(value: LayoutDisplayValueType) => handleChange('display', value)}
        />
      </PanelItem>
      {(isDisplayGrid || isDisplayFlex) && (
        <>
          {isDisplayGrid && (
            <>
              <PanelItem width={120} align="center" label="Grid">
                <FlexContainer>
                  <GridDimensionsInputs onChange={handleChangeGrid} value={gridValue} />
                  <Popover
                    open={showGridSettings}
                    placement="leftBottom"
                    content={
                      <GridSettings
                        onCancel={setShowGridSettings}
                        onChange={value => handleChange('gridSettings', value)}
                        value={value.gridSettings || gridSettingsDefaultValue}
                      />
                    }
                  >
                    <Button
                      onClick={setShowGridSettings}
                      type="secondary-outlined"
                      size="x-small"
                      icon={<Icon name="settings-2_outlined" />}
                    />
                  </Popover>
                </FlexContainer>
              </PanelItem>
            </>
          )}
          <PanelItem label="Direction">
            <Segmented
              size="small"
              block
              options={optionsDirectionMock}
              onChange={(value: AlignOrientationProps) => handleChange('direction', value)}
              value={value.direction || 'row'}
            />
          </PanelItem>
          <PanelItem label="Align">
            <AlignThemed
              display={value.display}
              orientation={value.direction || 'row'}
              onChange={(value: AlignVariation) => handleChange('align', value)}
              value={value.align || layoutDefaultValue.align}
            />
          </PanelItem>
          <PanelItem width={120} align="center" label="Gap">
            <DualInput
              firstInputDesc="Columns"
              secondInputDesc="Rows"
              FirstInput={GapInputComponent}
              SecondInput={GapInputComponent}
              firstName="column"
              secondName="row"
              onChange={(value: LayoutGapValueType) => handleChange('gap', value)}
              value={value.gap}
            />
          </PanelItem>
        </>
      )}
      {!isDisplayNone && (
        <>
          <Button
            size="x-small"
            type="secondary-outlined"
            suffix={<Icon name="arrow-bottom_outlined" rotate={showAdvancedOptions ? 180 : 0} />}
            onClick={toggleAdvancedOptions}
          >
            Advanced options
          </Button>
          {showAdvancedOptions && isDisplayGrid && (
            <>
              <PanelItem label="Columns">
                <Segmented
                  size="small"
                  block
                  options={optionsColumns}
                  value={value.columns}
                  onChange={(value: GridJustifyType) => handleChange('columns', value)}
                />
              </PanelItem>
              <PanelItem label="Rows">
                <Segmented
                  size="small"
                  block
                  options={optionsRows}
                  value={value.rows}
                  onChange={(value: GridJustifyType) => handleChange('rows', value)}
                />
              </PanelItem>
            </>
          )}
          {showAdvancedOptions && (
            <PanelItem label="Order">
              <Input
                type="number"
                size="x-small"
                placeholder="0"
                onChange={e => handleChange('order', e.target.value)}
                value={value.order}
              />
            </PanelItem>
          )}
        </>
      )}
    </Root>
  );
};

const FlexContainer = styled.div`
  display: flex;
  gap: 4px;

  & > button {
    min-width: 20px;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default LayoutEditor;
export type { LayoutThemedValue } from './types';
