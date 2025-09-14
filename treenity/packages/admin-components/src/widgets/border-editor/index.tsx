import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { isEqual, merge } from '@s-libs/micro-dash';
import { useToken } from '@treenity/ui-kit/theme';
import { FC, useCallback, useEffect, useState } from 'react';
import type { BorderMatrixItems } from './BorderMatrix';
import BorderMatrix from './BorderMatrix';
import type { BorderRadiusValues } from './BorderRadius';
import BorderRadius from './BorderRadius';
import type { BorderStylesProps } from './BorderStyle';
import BorderStyle from './BorderStyle';

export type BorderStyleValues = Record<BorderMatrixItems, BorderStylesProps>;

export interface BorderThemedValue {
  radius: BorderRadiusValues;
  styles: Omit<BorderStyleValues, 'all'>;
}

interface BorderThemedProps {
  value?: BorderThemedValue;
  onChange?(value: BorderThemedValue): void;
}

const BorderThemed: FC<BorderThemedProps> = ({ value, onChange }) => {
  const { token } = useToken();

  const defaultBorderStyleValue: BorderStylesProps = {
    width: '0px',
    color: null,
    style: 'none',
  };

  const [borderMatrixValue, setBorderMatrixValue] = useState<BorderMatrixItems>('all');

  const [borderStyles, setBorderStyles] = useState<Omit<BorderStyleValues, 'all'>>(
    value?.styles ?? {
      top: defaultBorderStyleValue,
      left: defaultBorderStyleValue,
      right: defaultBorderStyleValue,
      bottom: defaultBorderStyleValue,
    },
  );

  const [borderRadius, setBorderRadius] = useState<BorderRadiusValues>({
    topLeft: value?.radius?.topLeft || '0px',
    topRight: value?.radius?.topRight || '0px',
    bottomLeft: value?.radius?.bottomLeft || '0px',
    bottomRight: value?.radius?.bottomRight || '0px',
  });

  const onHandleChange = useCallback(
    (newValues: BorderThemedValue) => {
      if (!isEqual(newValues, value)) {
        onChange?.(newValues);
      }
    },
    [borderRadius, borderStyles, onChange],
  );

  const onChangeStyles = useCallback(
    (values: BorderStylesProps) => {
      setBorderStyles(prevState => {
        let newValue = { ...prevState };
        const updateValue = merge(defaultBorderStyleValue, values);

        if (borderMatrixValue === 'all') {
          newValue = {
            top: updateValue,
            left: updateValue,
            bottom: updateValue,
            right: updateValue,
          };
        } else if (newValue[borderMatrixValue]) {
          newValue[borderMatrixValue] = updateValue;
        }

        const newBorderStyles = { ...newValue, [borderMatrixValue]: updateValue };
        onHandleChange({ styles: newBorderStyles, radius: borderRadius });
        return newValue;
      });
    },

    [borderMatrixValue, defaultBorderStyleValue, borderRadius, onChange],
  );

  const onChangeBorderRadius = (newRadius: BorderRadiusValues) => {
    setBorderRadius(prevState => {
      const newValue = { ...prevState, ...newRadius };
      onHandleChange({ radius: newValue, styles: borderStyles });
      return newValue;
    });
  };

  useEffect(() => {
    const newValue = { radius: borderRadius, styles: borderStyles };
    if (value && !isEqual(newValue, value)) {
      setBorderRadius(value.radius);
      setBorderStyles(value.styles);
    }
  }, [value]);

  return (
    <div>
      <TopSide>
        <BorderMatrix onChange={setBorderMatrixValue} value={borderMatrixValue} />
        <BorderStyle
          value={borderStyles?.[borderMatrixValue === 'all' ? 'top' : borderMatrixValue]}
          onChange={onChangeStyles}
        />
      </TopSide>
      <PanelItem label="Radius">
        <BorderRadius value={borderRadius} onChange={onChangeBorderRadius} />
      </PanelItem>
    </div>
  );
};

const TopSide = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${p => p.theme.gray400};
`;

export default BorderThemed;
