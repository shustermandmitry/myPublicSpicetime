import Icon from '@/components/icon';
import Segmented from '@/components/Segmented';
import styled from '@emotion/styled';
import { isEqual } from '@s-libs/micro-dash';
import React, { FC, useEffect, useState } from 'react';
import InputWithUnits from '../input-with-units';

type BorderRadiusItem = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type BorderRadiusValues = Record<BorderRadiusItem, string>;

const optionsBorderRadius = [
  {
    value: 'all',
    icon: <Icon name="empty_outlined" />,
  },
  {
    value: 'individual',
    icon: <Icon name="border-radius-fine-tune_outlined" />,
  },
];

interface BorderRadiusProps {
  value: BorderRadiusValues;
  onChange(value: BorderRadiusValues): void;
}

const BorderRadius: FC<BorderRadiusProps> = ({ value, onChange }) => {
  const areAllValuesEqual = (obj: BorderRadiusValues) => {
    const values = Object.values(obj);
    const res = values.every(value => isEqual(value, values[0]));
    if (res) {
      return 'all';
    }

    return 'individual';
  };

  const [type, setType] = useState<string>(areAllValuesEqual(value));
  const [valueProps, setValueProps] = useState<BorderRadiusValues>(value);

  useEffect(() => {
    if (!isEqual(valueProps, value)) {
      setValueProps(value);
    }
  }, [value]);

  useEffect(() => {}, []);

  const onChangeType = (value: string) => {
    setType(value);
    if (value === 'all') {
      const unifiedValue = valueProps['topLeft'];
      const newValue = {
        topLeft: unifiedValue,
        topRight: unifiedValue,
        bottomLeft: unifiedValue,
        bottomRight: unifiedValue,
      };
      setValueProps(newValue);
      onChange(newValue);
    }
  };

  const onChangeValue = (value: string = '0px', name?: BorderRadiusItem) => {
    setValueProps((prevPoints: BorderRadiusValues) => {
      let newValue = { ...prevPoints };

      if (name) {
        newValue[name] = value;
      } else {
        newValue = {
          topLeft: value,
          topRight: value,
          bottomLeft: value,
          bottomRight: value,
        };
      }

      onChange(newValue);
      return newValue;
    });
  };

  return (
    <Root>
      <Segmented
        block
        size="small"
        options={optionsBorderRadius}
        value={type}
        onChange={value => onChangeType(value as string)}
      />
      <InputWithUnits
        isHideAuto
        size="small"
        disabled={type === 'individual'}
        value={type === 'individual' ? '0px' : valueProps['topLeft']}
        onChange={value => onChangeValue(value)}
      />

      {type === 'individual' && (
        <>
          <InputContainer>
            <Icon name="border-radius-left-top_outlined" />
            <InputWithUnits
              isHideAuto
              value={valueProps['topLeft']}
              size="x-small"
              onChange={value => onChangeValue(value, 'topLeft')}
            />
          </InputContainer>
          <InputContainer>
            <InputWithUnits
              isHideAuto
              value={valueProps['topRight']}
              size="x-small"
              onChange={value => onChangeValue(value, 'topRight')}
            />
            <Icon name="border-radius-left-top_outlined" rotate={90} />
          </InputContainer>
          <InputContainer>
            <Icon name="border-radius-left-top_outlined" rotate={270} />
            <InputWithUnits
              isHideAuto
              value={valueProps['bottomLeft']}
              size="x-small"
              onChange={value => onChangeValue(value, 'bottomLeft')}
            />
          </InputContainer>
          <InputContainer>
            <InputWithUnits
              isHideAuto
              value={valueProps['bottomRight']}
              size="x-small"
              onChange={value => onChangeValue(value, 'bottomRight')}
            />
            <Icon name="border-radius-left-top_outlined" rotate={180} />
          </InputContainer>
        </>
      )}
    </Root>
  );
};

const InputContainer = styled.div`
  display: flex;

  && i {
    font-size: 20px;
  }
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
`;

export default BorderRadius;
