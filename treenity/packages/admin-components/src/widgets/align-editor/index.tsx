import Icon from '@/components/icon';
import Select from '@/components/select';
import styled from '@emotion/styled';
import { FC } from 'react';
import PanelItem from '../panel-item';
import AlignMatrix, { getValue } from './AlignMatrix';
import { ListAlignHorizontal, ListAlignVertical } from './list';
import type { AlignThemedProps, AlignVariation } from './types';

const AlignThemed: FC<AlignThemedProps> = ({ value, onChange, orientation, display }) => {
  const changePart = (index: number, newAlign: string) => {
    const string = value ?? 'left_start';
    const parts = string.split('_');
    if (index >= 0 && index < parts.length) {
      parts[index] = newAlign;
    }
    const res = parts.join('_') as AlignVariation;

    if (res) {
      onChange(res);
    }
  };

  return (
    <Root>
      <AlignMatrix orientation={orientation} onSelect={onChange} value={value} display={display} />
      <SelectorsContainer>
        <PanelItem align="center" label="Justify" labelWidth={32}>
          <Select
            size="x-small"
            style={{ width: 120 }}
            suffixIcon={<Icon name="arrow-bottom_outlined" />}
            options={ListAlignHorizontal}
            value={getValue(0, value)}
            onChange={value => changePart(0, value)}
          />
        </PanelItem>
        <PanelItem align="center" label="Align" labelWidth={32}>
          <Select
            size="x-small"
            style={{ width: 120 }}
            suffixIcon={<Icon name="arrow-bottom_outlined" />}
            options={ListAlignVertical}
            value={getValue(1, value)}
            onChange={value => changePart(1, value)}
          />
        </PanelItem>
      </SelectorsContainer>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  gap: 4px;
  align-items: start;
`;

const SelectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

export default AlignThemed;
