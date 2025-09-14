import ColorPicker from '@/components/color-picker';
import Icon from '@/components/icon';
import type { IconNamesMap } from '@/components/icon/icon-component/types';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import React, { FC, useCallback, useMemo } from 'react';
import InputWithUnits from '../input-with-units';

export interface ShadowThemedValue {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string | null;
}

interface ShadowThemedProps {
  value?: ShadowThemedValue;
  onChange?: (value: ShadowThemedValue | undefined) => void;
}

const defaultColor = null;

const filledValue: ShadowThemedValue = {
  x: '0px',
  y: '0px',
  blur: '0px',
  spread: '0px',
  color: defaultColor,
};

const defaultValue: ShadowThemedValue = {
  x: undefined,
  y: undefined,
  blur: undefined,
  spread: undefined,
  color: defaultColor,
};

const isValidValue = (value: string | undefined): boolean => {
  if (!value) return false;
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue !== 0;
};

const icons: Record<keyof Omit<ShadowThemedValue, 'color'>, IconNamesMap> = {
  x: 'x-axis_outlined',
  y: 'y-axis_outlined',
  blur: 'shadow-blur_outlined',
  spread: 'shadow-spread_outlined',
};

const paramNames = ['x', 'y', 'blur', 'spread'] as const;

const ShadowThemed: FC<ShadowThemedProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (name: keyof ShadowThemedValue) => (newValue?: string | null) => {
      if (name === 'color' && newValue !== undefined) {
        const res = { ...(value || defaultValue), color: newValue };
        onChange?.(res);
        return;
      }

      const updatedValue: ShadowThemedValue = { ...value, [name]: newValue };
      const hasValidValue = paramNames.some(key => isValidValue(updatedValue[key]));
      if (!hasValidValue) {
        onChange?.({ ...defaultValue, color: value?.color || defaultColor });
        return;
      }

      const finalValue = paramNames.reduce(
        (acc, key) => {
          acc[key] = isValidValue(updatedValue[key]) ? updatedValue[key] : filledValue[key];
          return acc;
        },
        { ...filledValue, color: value?.color || defaultColor },
      );

      onChange?.(finalValue);
    },
    [value, onChange],
  );

  const inputs = useMemo(
    () =>
      paramNames.map(key => (
        <PanelItem key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
          <InputWithUnits
            isHideAuto
            icon={<Icon name={icons[key]} />}
            value={value?.[key]}
            onChange={handleChange(key)}
          />
        </PanelItem>
      )),
    [value, handleChange],
  );

  return (
    <Root>
      <Grid>{inputs}</Grid>
      <PanelItem label="Color">
        <ColorPicker
          size="small"
          value={value?.color}
          defaultValue={defaultColor}
          onChange={value => handleChange('color')(value ? value?.toHexString() : null)}
        />
      </PanelItem>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  column-gap: 12px;
  margin-bottom: 4px;
`;

export default ShadowThemed;
