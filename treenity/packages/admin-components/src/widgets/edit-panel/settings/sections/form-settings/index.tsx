/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Input from '@/components/input';
import Segmented from '@/components/Segmented';
import CollapseContainer from '@/widgets/CollapseContainer';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import React, { FC, useMemo } from 'react';
import FieldsFormSettings, { defaultValueFieldsFormSettings } from './fields-form-settings/Fields';
import { METHOD_OPTIONS, STATE_OPTIONS } from './list';
import {
  FormSettingsProps,
  IFormSettingsValues,
  SettingsFormMethodValuesType,
  SettingsFormStateValuesType,
} from './types';

export const defaultValueFormSettings: IFormSettingsValues = {
  state: 'default',
  name: '',
  redirect: '',
  action: '',
  method: 'get',
  fields: defaultValueFieldsFormSettings,
};

const FormSettings: FC<FormSettingsProps> = ({ onChange, value }) => {
  const handleChange = <K extends keyof IFormSettingsValues>(
    name: K,
    values: IFormSettingsValues[K],
  ) => {
    const newValue = { ...value, [name]: values } as IFormSettingsValues;
    onChange(newValue);
  };

  const memoizedValue: IFormSettingsValues = useMemo(
    () => Object.assign({}, defaultValueFormSettings, value),
    [value],
  );

  return (
    <Root>
      <CollapseContainer title="Form settings" isOpen>
        <PanelItem label="State">
          <Segmented
            block
            size="small"
            options={STATE_OPTIONS}
            value={memoizedValue.state}
            onChange={(value: SettingsFormStateValuesType) => handleChange('state', value)}
          />
        </PanelItem>
        <PanelItem label="Name">
          <Input
            value={memoizedValue.name}
            placeholder="form-name"
            onChange={e => handleChange('name', e.target.value)}
          />
        </PanelItem>
        <PanelItem label="Redirect">
          <Input
            value={memoizedValue.redirect}
            placeholder="URL or /success state"
            onChange={e => handleChange('redirect', e.target.value)}
          />
        </PanelItem>
        <PanelItem label="Action">
          <Input
            value={memoizedValue.action}
            onChange={e => handleChange('action', e.target.value)}
          />
        </PanelItem>
        <PanelItem label="Method">
          <Segmented
            block
            size="small"
            options={METHOD_OPTIONS}
            value={memoizedValue.method}
            onChange={(value: SettingsFormMethodValuesType) => handleChange('method', value)}
          />
        </PanelItem>
        <PanelItem label="Fields">
          <FieldsFormSettings
            value={memoizedValue.fields}
            onChange={value => handleChange('fields', value)}
          />
        </PanelItem>
      </CollapseContainer>
    </Root>
  );
};

const Root = styled.div``;

export default FormSettings;
