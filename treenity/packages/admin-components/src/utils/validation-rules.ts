/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Rule } from 'antd/lib/form';

export const len = (length: number): Rule => ({
  len: length,
  message: `Field must be exact ${length} characters`,
});

export const required = {
  required: true,
  message: 'Required field',
};

export const noSpaces = {
  pattern: /^[a-zA-Z0-9_]+$/,
  message: 'Must not contain spaces',
};

export const minLength = (minValue?: number) => {
  const _minValue = minValue || 0;
  return {
    validator: (_: any, value: string | number) => {
      if (Number(value) >= _minValue || !value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(`Minimum value ${_minValue}`));
    },
  };
};

export const maxLength = (maxValue?: number) => {
  const _maxValue = maxValue || 1;
  return {
    validator: (_: any, value: string | number) => {
      if (Number(value) <= _maxValue || !value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(`Maximum value ${_maxValue}`));
    },
  };
};

export const notEmptyArray = {
  validator: (_: any, value: any[]) => {
    if (Array.isArray(value) && value.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('The array must not be empty'));
  },
};

export const requiredCode: Rule[] = [required, len(6)];
export const requiredEmail: Rule[] = [
  required,
  {
    type: 'email',
    message: 'Incorrect email',
  },
];
