import Button from '@/components/button';
import Icon from '@/components/icon';
import Segmented from '@/components/Segmented';
import InputWithUnits from '@/widgets/input-with-units';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import React, { FC, useState } from 'react';
import { Buttons, Root } from './styles';
import { GridSettingsCRType, IGridSettingsValueCR } from './types';

interface GridEditSettingsProps {
  value: IGridSettingsValueCR;
  onCancel(): void;
  onChange(value: IGridSettingsValueCR): void;
}

const defaultValue = '1px';

const formatOptions: { label: string; value: GridSettingsCRType }[] = [
  { label: 'Fixed', value: 'fixed' },
  { label: 'Auto', value: 'auto' },
  { label: 'Min/Max', value: 'min-max' },
];

const GridEditSettings: FC<GridEditSettingsProps> = ({ value, onCancel, onChange }) => {
  const [localValue, setLocalValue] = useState<IGridSettingsValueCR>(value);

  const handleFormatChange = (format: GridSettingsCRType) => {
    const newSize =
      format === 'min-max'
        ? { min: defaultValue, max: defaultValue }
        : format === 'fixed'
          ? defaultValue
          : undefined;

    setLocalValue(prev => ({ ...prev, format, size: newSize }));
  };

  const handleSizeChange = (newSize: string | undefined, key?: 'min' | 'max') => {
    setLocalValue(prev => {
      if (prev.format === 'min-max' && key) {
        return {
          ...prev,
          size: {
            ...(prev.size as { min: string; max: string }),
            [key]: newSize || defaultValue,
          },
        };
      } else if (prev.format === 'fixed') {
        return { ...prev, size: newSize || defaultValue };
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (JSON.stringify(localValue) !== JSON.stringify(value)) {
      onChange(localValue);
    }
    onCancel();
  };

  return (
    <Root>
      <PanelItem label="Format">
        <Segmented
          size="small"
          block
          options={formatOptions}
          value={localValue.format}
          onChange={handleFormatChange}
        />
      </PanelItem>
      {localValue.format !== 'auto' && (
        <PanelItem label="Size">
          {localValue.format === 'min-max' ? (
            <DualInputs>
              <InputWithUnits
                size="x-small"
                placeholder="Min"
                value={(localValue.size as { min: string; max: string })?.min}
                onChange={newValue => handleSizeChange(newValue, 'min')}
              />
              <InputWithUnits
                size="x-small"
                placeholder="Max"
                value={(localValue.size as { min: string; max: string })?.max}
                onChange={newValue => handleSizeChange(newValue, 'max')}
              />
            </DualInputs>
          ) : (
            <InputWithUnits
              size="x-small"
              placeholder="1fr"
              value={localValue.size as string}
              onChange={newValue => handleSizeChange(newValue)}
            />
          )}
        </PanelItem>
      )}
      <Buttons>
        <Button
          type="secondary-filled"
          size="x-small"
          block
          icon={<Icon name="x-axis_outlined" />}
          onClick={onCancel}
        />
        <Button
          type="primary"
          size="x-small"
          block
          icon={<Icon name="check_outlined" />}
          onClick={handleSubmit}
        />
      </Buttons>
    </Root>
  );
};

const DualInputs = styled.div`
  display: flex;
  gap: 4px;
`;

export default GridEditSettings;
