import Button from '@/components/button';
import ColorPicker from '@/components/color-picker';
import Icon from '@/components/icon';
import Input from '@/components/input';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';

import React, { FC } from 'react';
import { IPoint } from './index';

interface PointInputsProps {
  index: number;
  count: number;
  value?: IPoint;
  onChange(values: IPoint): void;
  onRemove(key: number): void;
}

const PointInput: FC<PointInputsProps> = ({ index, count, value, onChange, onRemove }) => {
  const handleChange = <K extends keyof IPoint>(name: K, newValue: IPoint[K]) => {
    const updateValue = {
      ...value,
      [name]: newValue,
    } as IPoint;

    onChange?.(updateValue);
  };

  const isShowButton = count > 2;

  return (
    <PointItem showButton={isShowButton}>
      <Input
        min={0}
        max={100}
        suffix="%"
        type="number"
        size="x-small"
        placeholder="0"
        value={value?.position}
        onChange={e => handleChange('position', Number(e.target.value))}
      />
      <ColorPicker
        format="rgb"
        size="small"
        value={value?.color}
        onChangeComplete={value => handleChange('color', value ? value?.toRgbString() : null)}
      />
      {isShowButton && (
        <Button
          type="secondary-outlined"
          onClick={() => onRemove(index)}
          size="x-small"
          icon={<Icon name="border-solid_outlined" />}
        />
      )}
    </PointItem>
  );
};

export const PointItem = styled('div', omitProps('showButton'))<{ showButton: boolean }>`
  display: grid;
  grid-template-columns: 23% auto ${p => p.showButton && '20px'};
  gap: 4px;

  button {
    i {
      color: ${p => p.theme.colorText};
    }
  }
`;

export default PointInput;
