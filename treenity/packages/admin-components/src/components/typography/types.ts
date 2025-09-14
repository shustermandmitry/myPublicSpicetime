/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { CSSProperties, PropsWithChildren } from 'react';

export type TFontUnit = 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw';

export const textSizes: Record<TSizeTextContentNumbers, TSizeTextContentValues> = {
  8: 'xxxs',
  10: 'xxs',
  12: 'xs',
  14: 's',
  16: 'sm',
  20: 'md',
  24: 'lg',
  28: 'xl',
  32: 'xxl',
  36: 'xxxl',
  48: 'xxxxl',
  64: 'xxxxxl',
};

export type TSizeTextContentNumbers = 8 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 48 | 64;
export type TSizeTextContentValues =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 's'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'xxxxl'
  | 'xxxxxl';

export type TSizeTextContent = TSizeTextContentValues | TSizeTextContentNumbers;
export type TFontWeightTextContent = 800 | 700 | 600 | 500 | 400 | 300;

export type TagTypes = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

export interface ITypographyComponent<TagType> extends PropsWithChildren {
  className?: string;
  style?: CSSProperties;
  size?: TSizeTextContent;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  fontWeight?: TFontWeightTextContent;
  color?: string;
  as?: TagType;
}
