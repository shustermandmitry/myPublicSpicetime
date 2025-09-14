/*
 * Copyright (c) 2024. Treenity Inc.
 */

import WrapperWithReset from '@/widgets/WrapperWithReset';
import styled from '@emotion/styled';
import { ColorPicker as AntdColorPicker, ColorPickerProps } from 'antd';
import { generateColor } from 'antd/lib/color-picker/util.js';
import { FC } from 'react';
import ColorPickerPresets from './ColorPickerPresets';

const sizeMap: Record<string, string> = {
  large: 'LG',
  middle: 'MD',
  small: 'SM',
};

type ColorPickerStyledType = 'large' | 'middle' | 'small';

export interface ColorPickerStyledProps extends ColorPickerProps {
  size?: ColorPickerStyledType;
  onReset?: () => void;
}

const defaultColor = generateColor('transparent').toHex();

const ColorPicker: FC<ColorPickerStyledProps> = ({
  onChange,
  onReset,
  onChangeComplete,
  value,
  ...restProps
}) => {
  //TODO: fix any type
  const setDefaultValue = () => {
    onChange?.(null as any, '');
    onChangeComplete?.(null as any);
  };

  const customPanelRender: ColorPickerProps['panelRender'] = (_, { components: { Picker } }) => (
    <ColorPickerDropdown>
      <Picker />
      <ColorPickerPresets
        color={value as null | string}
        // @ts-ignore
        onClick={color => onChange?.(generateColor(color), color)}
      />
    </ColorPickerDropdown>
  );

  const handleReset = () => {
    onReset ? onReset() : setDefaultValue();
  };

  return (
    <WrapperWithResetStyled onReset={handleReset}>
      <ColorPickerStyled
        panelRender={customPanelRender}
        showText
        onChange={onChange}
        onChangeComplete={onChangeComplete}
        // @ts-ignore
        defaultValue={defaultColor}
        value={value}
        {...restProps}
      />
    </WrapperWithResetStyled>
  );
};

const WrapperWithResetStyled = styled(WrapperWithReset)`
  &&& .ant-collapse-header {
    display: none;
  }

  &&& .ant-color-picker-color-block.ant-color-picker-presets-color:before {
    border-radius: 6px;
  }

  .ant-color-picker
    .ant-color-picker-inner
    .ant-color-picker-presets
    .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    padding: 0;
  }
`;

const ColorPickerDropdown = styled.div`
  width: 234px;

  .ant-color-picker-input-container {
    align-items: center;
  }

  .ant-select {
    height: 22px;
  }

  .ant-color-picker-input > .ant-input-affix-wrapper {
    height: 22px;
  }

  .ant-color-picker-rgb-input,
  .ant-color-picker-hsb-input,
  .ant-color-picker-alpha-input {
    border-radius: 4px;
    height: 22px;

    & input {
      height: 20px;
    }
  }
`;

const ColorPickerStyled = styled(AntdColorPicker)<ColorPickerStyledProps>`
  width: 100%;
  justify-content: flex-start;
  padding-left: 6px;
  background-color: ${p => p.theme.colorBgContainer};
  box-shadow: none !important;

  && > .ant-color-picker-clear {
    width: 12px;
    height: 12px;
  }

  // TODO: fix antd types

  height: ${p => {
    // @ts-ignore
    return p.theme.ColorPicker[`controlHeight${sizeMap[p.size]}`];
  }}px;
  border-radius: ${p => {
    //@ts-ignore
    return p.theme.ColorPicker[`borderRadius${sizeMap[p.size]}`];
  }}px;

  .ant-color-picker-trigger-text {
    font-size: ${p => {
      //@ts-ignore
      return p.theme.ColorPicker[`fontSize${sizeMap[p.size]}`];
    }}px;
  }

  .ant-color-picker-color-block {
    width: 12px !important;
    height: 12px !important;
  }
`;

export default ColorPicker;
