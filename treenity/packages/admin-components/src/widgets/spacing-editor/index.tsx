import OffsetPosition from '@/widgets/position-editor/OffsetPosition';
import React, { FC, useCallback, useMemo } from 'react';

type SpacingValue = string | undefined;

interface SpacingThemedValues {
  top?: SpacingValue;
  bottom?: SpacingValue;
  left?: SpacingValue;
  right?: SpacingValue;
}

export interface SpacingThemedValue {
  margin: SpacingThemedValues;
  padding: SpacingThemedValues;
}

interface SpacingThemedProps {
  value?: Partial<SpacingThemedValue>;
  onChange?(value: SpacingThemedValue): void;
}

export const defaultValue: SpacingThemedValue = {
  margin: {
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  },
  padding: {
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  },
};

const SpacingThemed: FC<SpacingThemedProps> = ({ onChange, value }) => {
  const handleChange = useCallback(
    <K extends keyof SpacingThemedValue>(name: K) =>
      (newValue: SpacingThemedValues) => {
        onChange?.({
          ...defaultValue,
          ...value,
          [name]: newValue,
        });
      },
    [onChange, value],
  );

  const memoizedValue: SpacingThemedValue = useMemo(
    () => Object.assign({}, defaultValue, value),
    [value],
  );

  const PaddingOffset = useMemo(
    () => (
      <OffsetPosition
        label="Padding"
        value={memoizedValue.padding}
        onChange={handleChange('padding')}
        isHideAuto
      />
    ),
    [memoizedValue.padding, handleChange],
  );

  return (
    <OffsetPosition
      label="Margin"
      value={memoizedValue.margin}
      centerContent={PaddingOffset}
      onChange={handleChange('margin')}
      hideTies={{ vertical: true, horizontal: true }}
    />
  );
};

export default SpacingThemed;
