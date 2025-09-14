/*
 * Copyright (c) 2024. Treenity Inc.
 */

export type NormalizeSizeType = 'x-small' | 'small' | 'middle' | 'large' | 'x-large';

export const normalizeComponentSize = (size: NormalizeSizeType) => {
  if (size === 'x-large') {
    return 'large';
  }
  if (size === 'x-small') {
    return 'small';
  }
};
