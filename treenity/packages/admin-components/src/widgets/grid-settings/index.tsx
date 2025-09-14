import Button from '@/components/button';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import React, { FC, useState } from 'react';
import GridSettingsItem from './Item';

import {
  GridSettingsProps,
  IGridSettingsArea,
  IGridSettingsValue,
  IGridSettingsValueCR,
} from './types';

const defaultColumnsSettings: IGridSettingsValueCR = {
  format: 'fixed',
  size: '1fr',
};

const defaultRowsSettings: IGridSettingsValueCR = {
  format: 'auto',
};

export const defaultGridAreaSettings = {
  columns_start: 1,
  columns_end: 1,
  rows_start: 1,
  rows_end: 1,
};

export const gridSettingsDefaultValue: IGridSettingsValue = {
  columns: [defaultColumnsSettings],
  rows: [defaultRowsSettings],
  areas: [],
};

const GridSettings: FC<GridSettingsProps> = ({ value, onChange, onCancel }) => {
  const [localValue, setLocalValue] = useState<IGridSettingsValue>(value);

  const onRemove = <K extends keyof IGridSettingsValue>(name: K, index: number) => {
    const currentItems = [...(localValue[name] || [])];

    if (currentItems.length <= 1 && (name === 'columns' || name === 'rows')) {
      return;
    }

    currentItems.splice(index, 1);

    setLocalValue(prevState => ({
      ...prevState,
      [name]: currentItems,
    }));
  };

  const onDuplicate = <K extends keyof IGridSettingsValue>(name: K, index: number) => {
    const currentItems = [...(localValue[name] || [])];
    const itemToDuplicate = currentItems[index];

    const duplicatedItem = JSON.parse(JSON.stringify(itemToDuplicate));

    currentItems.splice(index + 1, 0, duplicatedItem);

    setLocalValue(prevState => ({
      ...prevState,
      [name]: currentItems,
    }));
  };

  const onAdd = <K extends keyof IGridSettingsValue>(name: K) => {
    const newItem =
      name === 'areas'
        ? defaultGridAreaSettings
        : name === 'columns'
          ? defaultColumnsSettings
          : defaultRowsSettings;

    setLocalValue(prevState => ({
      ...prevState,
      [name]: [...(localValue?.[name] || []), newItem],
    }));
  };

  const onEdit = <K extends keyof IGridSettingsValue>(
    name: K,
    index: number,
    newValue: IGridSettingsValueCR | IGridSettingsArea,
  ) => {
    const currentItems = [...(localValue?.[name] || [])];

    if (index < 0 || index >= currentItems.length) {
      console.warn(`Invalid index for editing ${name}`);
      return;
    }

    //@ts-ignore
    currentItems[index] = newValue;

    setLocalValue(prevState => ({
      ...prevState,
      [name]: currentItems,
    }));
  };

  const onSubmit = () => {
    onChange(localValue);
    onCancel();
  };

  return (
    <Root>
      <Container>
        <Title>COLUMNS</Title>
        <Content>
          {localValue?.columns?.map((columnItem, index) => (
            <GridSettingsItem
              key={`column-${index}`}
              icon="grid-columns-settings_outlined"
              value={columnItem}
              index={index}
              onDuplicate={() => onDuplicate('columns', index)}
              onRemove={() => onRemove('columns', index)}
              onChange={value => onEdit('columns', index, value)}
            />
          ))}
          <Button
            block
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="plus_outlined" />}
            onClick={() => onAdd('columns')}
          />
        </Content>
      </Container>
      <Container>
        <Title>ROWS</Title>
        <Content>
          {localValue?.rows?.map((rowsItem, index) => (
            <GridSettingsItem
              key={`row-${index}`}
              index={index}
              icon="grid-rows-settings_outlined"
              value={rowsItem}
              onDuplicate={() => onDuplicate('rows', index)}
              onRemove={() => onRemove('rows', index)}
              onChange={value => onEdit('rows', index, value)}
            />
          ))}

          <Button
            block
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="plus_outlined" />}
            onClick={() => onAdd('rows')}
          />
        </Content>
      </Container>
      <Container>
        <Title>AREAS</Title>
        <Content>
          {localValue?.areas?.map((areaItem, index) => (
            <GridSettingsItem
              index={index}
              key={`area-${index}`}
              icon="add-table_outlined"
              value={areaItem}
              onDuplicate={() => onDuplicate('areas', index)}
              onRemove={() => onRemove('areas', index)}
              onChange={value => onEdit('areas', index, value)}
            />
          ))}
          <Button
            block
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="plus_outlined" />}
            onClick={() => onAdd('areas')}
          />
        </Content>
      </Container>
      <Buttons>
        <Button
          onClick={onCancel}
          block
          type="secondary-filled"
          size="small"
          icon={<Icon name="x-axis_outlined" color="primary" />}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          block
          type="primary"
          size="small"
          icon={<Icon name="save_outlined" />}
        >
          Save
        </Button>
      </Buttons>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 210px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 4px;
`;
const Container = styled.div``;

const Content = styled.div`
  border-radius: 6px;
  padding: 2px;
  border: 1px solid ${p => p.theme.gray400};

  & > button {
    width: 100% !important;
  }
`;

const Title = styled.p`
  color: ${p => p.theme.colorGrayText};
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
  line-height: 8px;
  letter-spacing: -0.32px;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 4px;
`;

export default GridSettings;
