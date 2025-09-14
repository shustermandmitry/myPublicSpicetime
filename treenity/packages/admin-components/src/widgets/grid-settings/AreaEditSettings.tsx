import Button from '@/components/button';
import Icon from '@/components/icon';
import Input from '@/components/input';
import styled from '@emotion/styled';
import React, { ChangeEvent, FC, useState } from 'react';
import { Buttons, Root } from './styles';
import { IGridSettingsArea } from './types';

interface AreaEditSettingsProps {
  value: IGridSettingsArea;
  onCancel(): void;
  onChange(value: IGridSettingsArea): void;
}

const AreaEditSettings: FC<AreaEditSettingsProps> = ({ value, onCancel, onChange }) => {
  const [newValues, setNewValues] = useState<IGridSettingsArea>(value);

  const handleChange = <K extends keyof IGridSettingsArea>(
    name: K,
    newValue: ChangeEvent<HTMLInputElement>,
  ) => {
    setNewValues(prevState => ({ ...prevState, [name]: Number(newValue.target.value) }));
  };

  const onSubmit = () => {
    onChange(newValues);
    onCancel();
  };

  return (
    <Root width={188}>
      <Content>
        <Item>
          <Inputs>
            <Input
              type="number"
              placeholder="0"
              value={newValues.columns_start}
              onChange={value => handleChange('columns_start', value)}
            />
            <Input
              type="number"
              placeholder="0"
              value={newValues.columns_end}
              onChange={value => handleChange('columns_end', value)}
            />
          </Inputs>
          <span>columns start/end</span>
        </Item>
        <Item>
          <Inputs>
            <Input
              type="number"
              placeholder="0"
              value={newValues.rows_start}
              onChange={value => handleChange('rows_start', value)}
            />
            <Input
              type="number"
              placeholder="0"
              value={newValues.rows_end}
              onChange={value => handleChange('rows_end', value)}
            />
          </Inputs>
          <span>rows start/end</span>
        </Item>
      </Content>
      <Buttons>
        <Button
          type="secondary-filled"
          size="x-small"
          block
          icon={<Icon name="x-axis_outlined" />}
          onClick={onCancel}
        />
        <Button
          onClick={onSubmit}
          type="primary"
          size="x-small"
          block
          icon={<Icon name="check_outlined" />}
        />
      </Buttons>
    </Root>
  );
};

const Content = styled.div`
  display: flex;
  gap: 4px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  & > span {
    color: ${p => p.theme.colorGrayText};
    text-align: center;
    font-size: 8px;
    font-weight: 800;
    line-height: 8px;
    letter-spacing: -0.32px;
    text-transform: uppercase;
  }
`;

const Inputs = styled.div`
  display: flex;
  gap: 4px;
`;

export default AreaEditSettings;
