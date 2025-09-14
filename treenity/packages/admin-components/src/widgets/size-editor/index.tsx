import Icon from '@/components/icon';
import Segmented from '@/components/Segmented';
import InputWithUnits from '@/widgets/input-with-units';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { FC, ReactElement } from 'react';

export type OverflowValue = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

interface OptionOverflow {
  value: OverflowValue;
  icon: string | ReactElement;
}

const optionsOverflow: OptionOverflow[] = [
  {
    value: 'visible',
    icon: <Icon name="eye_outlined" />,
  },
  {
    value: 'hidden',
    icon: <Icon name="eye-off_outlined" />,
  },
  {
    value: 'clip',
    icon: <Icon name="space-horizontal_outlined" />,
  },
  {
    value: 'scroll',
    icon: <Icon name="space-vertical_outlined" />,
  },
  {
    value: 'auto',
    icon: 'AUTO',
  },
];

export interface SizeThemedValue {
  width?: string;
  height?: string;
  min_width?: string;
  max_width?: string;
  min_height?: string;
  max_height?: string;
  overflow: OverflowValue;
}

interface SizeThemedProps {
  value?: SizeThemedValue;
  onChange?(values: SizeThemedValue): void;
}

const defaultValue: SizeThemedValue = {
  overflow: 'visible',
};

const SizeThemed: FC<SizeThemedProps> = ({ value = defaultValue, onChange }) => {
  const handleChange = (name: keyof SizeThemedValue) => (newValue?: string | OverflowValue) => {
    const updatedValue = { ...value, [name]: newValue || defaultValue[name] };
    onChange?.(updatedValue);
  };

  return (
    <div>
      <Grid>
        <PanelItem label="Width">
          <InputWithUnits value={value?.width} onChange={handleChange('width')} />
        </PanelItem>
        <PanelItem label="Height">
          <InputWithUnits value={value?.height} onChange={handleChange('height')} />
        </PanelItem>
        <PanelItem label="Min width">
          <InputWithUnits value={value?.min_width} onChange={handleChange('min_width')} />
        </PanelItem>
        <PanelItem label="Max width">
          <InputWithUnits
            isHideAuto
            value={value?.max_width}
            onChange={handleChange('max_width')}
          />
        </PanelItem>
        <PanelItem label="Min height">
          <InputWithUnits value={value?.min_height} onChange={handleChange('min_height')} />
        </PanelItem>
        <PanelItem label="Max height">
          <InputWithUnits
            isHideAuto
            value={value?.max_height}
            onChange={handleChange('max_height')}
          />
        </PanelItem>
      </Grid>
      <PanelItem label="Overflow">
        <Segmented<OverflowValue>
          block
          size="small"
          options={optionsOverflow}
          value={value?.overflow}
          onChange={value => handleChange('overflow')(value as OverflowValue)}
        />
      </PanelItem>
    </div>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  column-gap: 12px;
  margin-bottom: 4px;
`;

export default SizeThemed;
