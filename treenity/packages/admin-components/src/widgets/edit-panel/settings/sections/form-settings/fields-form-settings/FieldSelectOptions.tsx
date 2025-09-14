/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import Input from '@/components/input';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { omitProps } from '@treenity/ui-kit/utils';
import React, { FC, useCallback, useState } from 'react';

interface FieldSelectOptionProps {
  option: IFieldSelectOptionsValue;
  onChange(value: IFieldSelectOptionsValue): void;
  onRemove(): void;
}

interface IFieldSelectOptionsValue {
  label: string;
  value: string;
}

interface FieldSelectOptionsProps {
  value?: IFieldSelectOptionsValue[];
  onChange?(value: IFieldSelectOptionsValue[]): void;
}

const FieldSelectOptionItem: FC<FieldSelectOptionProps> = ({ option, onChange, onRemove }) => {
  const [isEdit, toggleEdit] = useToggle();
  const [newValue, setValue] = useState<IFieldSelectOptionsValue>(option);

  const onOk = useCallback(() => {
    if (isEdit) {
      onChange?.(newValue);
    }

    toggleEdit();
  }, [newValue, onChange, isEdit]);

  const onCancel = useCallback(() => {
    if (isEdit) {
      toggleEdit();
    } else {
      onRemove();
    }
  }, [isEdit]);

  const typeButton = isEdit ? 'primary' : 'secondary-outlined';

  return (
    <Item>
      <Input
        disabled={!isEdit}
        placeholder="Label"
        value={newValue.label}
        onChange={e =>
          setValue(prevState => ({
            ...prevState,
            label: e.target.value,
          }))
        }
      />
      <Input
        disabled={!isEdit}
        placeholder="Value"
        value={newValue.value}
        onChange={e =>
          setValue(prevState => ({
            ...prevState,
            value: e.target.value,
          }))
        }
      />
      <ButtonWithIconStyled
        size="x-small"
        type={typeButton}
        icon={<Icon name={isEdit ? 'check_outlined' : 'rename_outlined'} />}
        onClick={onOk}
      />
      <ButtonWithIconStyled
        isEdit={isEdit}
        size="x-small"
        danger={isEdit}
        type={typeButton}
        icon={<Icon name={isEdit ? 'close_outlined' : 'trash_outlined'} />}
        onClick={onCancel}
      />
    </Item>
  );
};

const FieldSelectOptions: FC<FieldSelectOptionsProps> = ({ value = [], onChange }) => {
  const handleChange = useCallback(
    (index: number) => (values?: IFieldSelectOptionsValue) => {
      if (values) {
        value[index] = values;
        onChange?.(value);
      }
    },
    [value, onChange],
  );

  const onRemove = useCallback(
    (index: number) => {
      const newValue = [...value.slice(0, index), ...value.slice(index + 1)];
      onChange?.(newValue);
    },
    [value, onChange],
  );

  const onAdd = useCallback(
    () =>
      onChange?.([
        ...value,
        {
          label: 'Label text',
          value: 'Value text',
        },
      ] as IFieldSelectOptionsValue[]),
    [value, onChange],
  );

  return (
    <Root>
      <Title>Options list</Title>
      {value.map((option, index) => (
        <FieldSelectOptionItem
          key={`${index}-${option.value}-${option.label}`}
          option={option}
          onChange={handleChange(index)}
          onRemove={() => onRemove(index)}
        />
      ))}
      <ButtonWithIcon
        type="secondary-outlined"
        size="x-small"
        icon={<Icon name="plus_outlined" />}
        onClick={onAdd}
      >
        Add select option
      </ButtonWithIcon>
    </Root>
  );
};

const ButtonWithIconStyled = styled(ButtonWithIcon, omitProps('isEdit'))<{ isEdit?: boolean }>`
  width: 20px;
  min-width: 20px;

  ${p =>
    p.isEdit === false &&
    css`
      i {
        color: ${p.theme.colorError} !important;
      }
    `}
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
`;

const Root = styled.div`
  border-radius: 6px;
  background: ${p => p.theme.base400};
  padding: 3px 6px 6px 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export default FieldSelectOptions;
