import WrapperWithReset from '@/widgets/WrapperWithReset';
import styled from '@emotion/styled';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input/Input';
import React, { ChangeEvent, FC } from 'react';

interface InputNumberThemedProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: number | null) => void;
}

const InputNumberThemed: FC<InputNumberThemedProps> = ({ value, onChange, ...restProps }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? null : Number(e.target.value);
    onChange?.(newValue);
  };

  const onReset = () => {
    onChange?.(null);
  };

  return (
    <WrapperWithReset onReset={onReset}>
      <InputStyled
        {...restProps}
        type="number"
        size="small"
        value={value ?? ''}
        onChange={handleChange}
        placeholder="0"
      />
    </WrapperWithReset>
  );
};

const InputStyled = styled(Input)`
  width: 100%;
  justify-content: flex-start;
  padding-left: 6px;
  background-color: ${p => p.theme.Panel.colorBgContainer};
  min-height: 20px;

  box-shadow: none !important;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
`;

export default InputNumberThemed;
