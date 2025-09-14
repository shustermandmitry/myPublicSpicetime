/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import { Popover } from 'antd';
import React, { FC, useState } from 'react';
import type { FieldsFormSettingsProps, IFieldFormSettingsValue } from '../types';
import FieldsFormComponent from './FieldsFormComponent';
import FieldsFormItem from './FieldsFormItem';
import { componentsList } from './list';

export const defaultValueFieldsFormSettings: IFieldFormSettingsValue[] = [
  {
    key: 'input-0',
    component: 'input',
    params: {
      name: 'input',
      label: 'Input',
    },
  },
];

const FieldsFormSettings: FC<FieldsFormSettingsProps> = ({ onChange, value }) => {
  const [showForm, toggleShowForm] = useState<string | undefined>(undefined);

  const handleChange = (index: number) => (values?: IFieldFormSettingsValue) => {
    if (values) {
      value[index] = values;
      onChange?.(value);
    }
  };

  const onAddItem = () => {
    const newValue = [
      ...value,
      {
        key: `input-${value.length}`,
        component: componentsList[0],
        params: {
          name: 'input',
          label: 'Input',
        },
      },
    ];

    onChange?.(newValue);
  };

  const onRemove = (index: number) => {
    delete value[index];
    onChange?.(value);
  };

  return (
    <Root>
      <List>
        {value.map((field, index) => (
          <Popover
            key={`${index}-${field.key}`}
            content={
              <FieldsFormComponent
                onChange={handleChange(index)}
                value={field}
                onCancel={() => toggleShowForm(undefined)}
              />
            }
            open={showForm === `${field.component}-${index}`}
            trigger="click"
          >
            <FieldsFormItem
              index={index}
              value={field}
              onEdit={() => toggleShowForm(`${field.component}-${index}`)}
              onRemove={() => onRemove(index)}
            />
          </Popover>
        ))}

        <Button
          type="secondary-outlined"
          size="x-small"
          icon={<Icon name="plus_outlined" />}
          onClick={onAddItem}
        >
          Add input field
        </Button>
      </List>
    </Root>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Root = styled.div``;

export default FieldsFormSettings;
