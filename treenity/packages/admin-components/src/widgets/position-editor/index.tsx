import Icon from '@/components/icon';
import Input from '@/components/input';
import Segmented from '@/components/Segmented';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import OffsetPosition from './OffsetPosition';

type PositionThemedPositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type PositionThemedOffsetValue = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export interface PositionThemedValue {
  position: PositionThemedPositionValue;
  offset: PositionThemedOffsetValue;
  relative?: string;
  zIndex?: number | 'auto';
}

export interface PositionThemedProps {
  onChange?(value: PositionThemedValue): void;
  value?: Partial<PositionThemedValue>;
}

interface PositionThemedSelectorProps {
  value: PositionThemedPositionValue;
  label: string | ReactNode;
}

export const POSITION_OPTIONS: PositionThemedSelectorProps[] = [
  { value: 'static', label: <Icon name="x-axis_outlined" /> },
  { value: 'relative', label: 'Relative' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'sticky', label: 'Sticky' },
];

export const defaultValue: PositionThemedValue = {
  position: 'static',
  relative: '#body',
  offset: {
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  zIndex: 'auto',
};

const PositionThemed: FC<PositionThemedProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    <K extends keyof PositionThemedValue>(name: K) =>
      (newValue: PositionThemedValue[K]) => {
        onChange?.({
          ...defaultValue,
          ...value,
          [name]: name === 'zIndex' ? (newValue === undefined ? 'auto' : newValue) : newValue,
        } as PositionThemedValue);
      },
    [onChange, value],
  );

  const memoizedValue: PositionThemedValue = useMemo(
    () => ({
      ...defaultValue,
      ...value,
      offset: { ...defaultValue.offset, ...value?.offset },
    }),
    [value],
  );

  const showPositionSettings =
    memoizedValue.position !== 'static' && memoizedValue.position !== 'relative';

  return (
    <Root>
      <PanelItem label="Position">
        <Segmented
          size="small"
          options={POSITION_OPTIONS}
          value={memoizedValue.position}
          onChange={handleChange('position')}
        />
      </PanelItem>
      {showPositionSettings && (
        <>
          <PanelItem label="Offset">
            <OffsetPosition value={memoizedValue.offset} onChange={handleChange('offset')} />
          </PanelItem>
          <HorizontalContainer>
            <PanelItem label="Relative">
              <Input
                placeholder="#body"
                size="x-small"
                value={memoizedValue.relative}
                onChange={e => handleChange('relative')(e.target.value)}
              />
            </PanelItem>
            <PanelItem label="Z-index">
              <Input
                placeholder="auto"
                type="number"
                size="x-small"
                value={memoizedValue.zIndex === 'auto' ? '' : memoizedValue.zIndex}
                onChange={e =>
                  handleChange('zIndex')(e.target.value === '' ? 'auto' : Number(e.target.value))
                }
              />
            </PanelItem>
          </HorizontalContainer>
        </>
      )}
    </Root>
  );
};

const HorizontalContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default PositionThemed;
