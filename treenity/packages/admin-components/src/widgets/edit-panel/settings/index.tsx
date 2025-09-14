/*
 * Copyright (c) 2024. Treenity Inc.
 */

import styled from '@emotion/styled';
import React, { FC, useMemo } from 'react';
import DefaultSection, { defaultValueDefaultSection } from './sections/default';
import type { IDefaultSectionValues } from './sections/default/types';
import FormSettings, { defaultValueFormSettings } from './sections/form-settings';
import type { IFormSettingsValues } from './sections/form-settings/types';
import MailsSettings, { defaultValueMailsSettings } from './sections/mails-settings';
import { IMailsSettingsValues } from './sections/mails-settings/types';
import type { ISettingsValues, SettingsProps } from './types';

const Settings: FC<SettingsProps> = ({ value, onChange }) => {
  const defaultValue: ISettingsValues = {
    default: { ...defaultValueDefaultSection },
    form: { ...defaultValueFormSettings },
    mails: { ...defaultValueMailsSettings },
  };

  const handleChange =
    (name: keyof ISettingsValues) =>
    (values?: IDefaultSectionValues | IFormSettingsValues | IMailsSettingsValues) => {
      const newValue = { ...value, [name]: values } as ISettingsValues;
      onChange?.(newValue);
    };

  const memoizedValue: ISettingsValues = useMemo(
    () => Object.assign({}, defaultValue, value),
    [value],
  );

  return (
    <Root>
      <DefaultSection value={memoizedValue.default} onChange={handleChange('default')} />
      <FormSettings value={memoizedValue.form} onChange={handleChange('form')} />
      <MailsSettings value={memoizedValue.mails} onChange={handleChange('mails')} />
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default Settings;
