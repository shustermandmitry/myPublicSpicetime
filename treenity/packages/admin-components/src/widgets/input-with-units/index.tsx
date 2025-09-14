import type { InputStyledProps, InputStyledSize } from '@/components/input';
import Input from '@/components/input';
import parseValueWithUnit from '@/widgets/input-with-units/parse-value';
import styled from '@emotion/styled';
import { isNumber } from '@s-libs/micro-dash';
import { omitProps } from '@treenity/ui-kit/utils';
import type { GetProps } from 'antd';
import { Dropdown, MenuProps, Slider } from 'antd';
import React, { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react';

type DropdownType = GetProps<typeof Dropdown>;

const units = ['auto', 'px', '%', 'em', 'rem', 'vw', 'svw', 'vh', 'svh'] as const;
export type UnitsType = (typeof units)[number];

export interface InputValueWithUnit {
  numericValue: number | null;
  unit: UnitsType;
  isAuto?: boolean;
}

export interface InputWithUnitsProps extends Omit<InputStyledProps, 'onChange' | 'value'> {
  icon?: ReactElement;
  withRange?: [number, number];
  step?: number;
  size?: InputStyledSize;
  value?: string;
  isHideAuto?: boolean;
  dropdownProps?: DropdownType;
  onChange?(value: string | undefined): void;
}

const InputWithUnits: FC<InputWithUnitsProps> = ({
  value,
  onChange,
  icon,
  withRange,
  step,
  size = 'x-small',
  className,
  dropdownProps,
  isHideAuto,
  ...restProps
}) => {
  const [inputState, setInputState] = useState<InputValueWithUnit>(() => parseValueWithUnit(value));

  useEffect(() => {
    setInputState(parseValueWithUnit(value));
  }, [value]);

  const items: MenuProps['items'] = units
    .map(unit => {
      if (isHideAuto && unit === 'auto') return;

      return {
        label: unit,
        key: unit,
        onClick: () => handleUnitChange(unit),
      };
    })
    .filter(i => !!i);

  const handleUnitChange = (unit: UnitsType) => {
    if (unit === 'auto') {
      onChange?.('auto');
      setInputState({ numericValue: null, unit: 'auto', isAuto: true });
    } else {
      onChange?.(`${inputState.numericValue || 0}${unit}`);
      setInputState({ ...inputState, unit, isAuto: false });
    }
  };

  const handleValueChange = (e: number | ChangeEvent<HTMLInputElement>) => {
    if (isNumber(e)) {
      // Handling slider change
      const newValue = e;
      onChange?.(`${newValue}${inputState.unit}`);
      setInputState(prev => ({ ...prev, numericValue: newValue, isAuto: false }));

      return;
    }

    const inputValue = e.target.value;

    if (inputState.isAuto && isNumber(Number(inputValue))) {
      onChange?.(inputValue);
      setInputState({ numericValue: Number(inputValue), unit: 'px', isAuto: false });

      return;
    }

    if (inputState.isAuto && inputValue !== 'auto') {
      onChange?.('');
      setInputState({ numericValue: null, unit: 'px', isAuto: false });

      return;
    }

    // If input is empty or becomes empty, reset the state
    if (!inputValue || inputValue === '') {
      onChange?.('');
      setInputState({ numericValue: null, unit: 'px', isAuto: false });

      return;
    }

    // Handle 'auto' value
    if (inputValue === 'auto' && !isHideAuto) {
      onChange?.('auto');
      setInputState(prev => ({ ...prev, numericValue: null, unit: 'auto', isAuto: true }));

      return;
    }

    // Try to parse number
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onChange?.(`${numericValue}${inputState.unit}`);
      setInputState(prev => ({ ...prev, numericValue, isAuto: false }));
    }
  };

  return (
    <Root withRange={!!withRange} className={className}>
      <InputContainer>
        <StyledInput
          className="input-with-units"
          size={size}
          placeholder="0"
          prefix={icon}
          value={inputState.isAuto ? 'auto' : inputState.numericValue ?? ''}
          onChange={handleValueChange}
          aria-label="Value input"
          {...restProps}
        />
        {!inputState.isAuto && (
          <Selector>
            <Dropdown menu={{ items }} trigger={['click']} placement="topRight" {...dropdownProps}>
              <span>{inputState.unit}</span>
            </Dropdown>
          </Selector>
        )}
      </InputContainer>
      {withRange && !inputState.isAuto && (
        <Slider
          value={inputState.numericValue ?? withRange[0]}
          min={withRange[0]}
          max={withRange[1]}
          onChange={handleValueChange}
          step={step}
          aria-label="Value range slider"
          tooltip={{ arrow: false }}
        />
      )}
    </Root>
  );
};

const Root = styled('div', omitProps('withRange'))<{ withRange?: boolean }>`
  display: grid;
  grid-template-columns: ${p => (p.withRange ? 'minmax(60px, 1fr) 3fr' : '1fr')};
  align-items: center;
  gap: 4px;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const Selector = styled.div`
  position: absolute;
  right: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 8px;
  color: ${p => p.theme.colorGrayText};
  cursor: pointer;

  span {
    padding: 0 4px;
  }
`;

const StyledInput = styled(Input)`
  outline: none !important;
  font-weight: 500;
  padding-right: ${p => (p.disabled ? '8px' : '22px')};

  .ant-input-group-addon {
    border-left: 0;
  }

  i {
    color: ${p => p.theme.Input.colorIcon};
    font-size: 12px !important;
  }
`;

export default InputWithUnits;
