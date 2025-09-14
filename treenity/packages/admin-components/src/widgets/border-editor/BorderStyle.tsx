import ColorPicker from '@/components/color-picker';
import Icon from '@/components/icon';
import Segmented from '@/components/Segmented';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import React, { FC, ReactNode } from 'react';
import InputWithUnits from '../input-with-units';

export type BorderStyleName = 'solid' | 'dashed' | 'dotted' | 'none';

interface OptionBorderStyle {
  value: BorderStyleName;
  icon: ReactNode;
}

export interface BorderStylesProps {
  width?: string;
  color: string | null;
  style: BorderStyleName;
}

interface BorderStyleProps {
  value: BorderStylesProps;
  onChange(value: BorderStylesProps): void;
}

const optionsBorderStyles: OptionBorderStyle[] = [
  {
    value: 'none',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'solid',
    icon: <Icon name="border-solid_outlined" />,
  },
  {
    value: 'dashed',
    icon: <Icon name="border-dash_outlined" />,
  },
  {
    value: 'dotted',
    icon: <Icon name="border-dotted_outlined" />,
  },
];

const BorderStyle: FC<BorderStyleProps> = ({ value, onChange }) => {
  const onHandleChange = <K extends keyof BorderStylesProps>(
    name: K,
    values: BorderStylesProps[K],
  ) => {
    const newValue = { ...value, [name]: values } as BorderStylesProps;

    onChange(newValue);
  };

  return (
    <Root>
      <PanelItem label="Width">
        <InputWithUnits
          isHideAuto
          value={value?.width}
          onChange={value => onHandleChange('width', value)}
        />
      </PanelItem>
      <PanelItem label="Color">
        <ColorPicker
          size="small"
          value={value?.color}
          onChange={value => onHandleChange('color', value ? value?.toHexString() : null)}
        />
      </PanelItem>
      <PanelItem label="Style">
        <Segmented<BorderStyleName>
          value={value?.style}
          size="small"
          block
          options={optionsBorderStyles}
          onChange={value => onHandleChange('style', value as BorderStyleName)}
        />
      </PanelItem>
    </Root>
  );
};

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default BorderStyle;
