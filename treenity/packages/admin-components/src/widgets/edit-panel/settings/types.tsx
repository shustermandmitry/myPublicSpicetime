/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { IDefaultSectionValues } from '@/widgets/edit-panel/settings/sections/default/types';
import { IFormSettingsValues } from '@/widgets/edit-panel/settings/sections/form-settings/types';
import type { IMailsSettingsValues } from '@/widgets/edit-panel/settings/sections/mails-settings/types';

export type ListTagsType =
  | 'text'
  | 'form'
  | 'structure'
  | 'table'
  | 'multimedia'
  | 'scripts'
  | 'meta'
  | 'embedding';

export interface ISettingsValues {
  default: IDefaultSectionValues;
  form: IFormSettingsValues;
  mails: IMailsSettingsValues;
}

export interface SettingsProps {
  value?: ISettingsValues;
  onChange?(value: ISettingsValues): void;
}
