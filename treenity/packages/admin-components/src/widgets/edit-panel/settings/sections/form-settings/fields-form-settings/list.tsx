/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { IFieldFormSettingsComponents } from '../types';

export const componentsList: IFieldFormSettingsComponents[] = [
  'input',
  'inputNumber',
  'select',
  'segmented',
  'checkbox',
  'switch',
  'textarea',
];

export const COMPONENTS_OPTIONS = componentsList.map(componentName => ({
  value: componentName,
  label: componentName,
}));
