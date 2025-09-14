/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { RenderItemFunction } from '@/types';
import { Styles } from '@/types/styles';

export type JustifyContentType =
  | 'space-between'
  | 'space-around'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'normal';
export type flexDirectionType = 'row' | 'column';
export type OverflowType =
  | 'visible'
  | 'hidden'
  | 'scroll'
  | 'auto'
  | 'inherit'
  | 'initial'
  | 'unset';
export type AlignItemsType = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'normal';
export type BorderRadiusType =
  | 'none'
  | '2px'
  | '4px'
  | '6px'
  | '8px'
  | '10px'
  | '12px'
  | '14px'
  | '16px'
  | '18px'
  | '20px'
  | '99999px';

export type RowsWidth = 'auto' | '100%' | 'min' | 'max';

type AlignSelfType = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'normal';

type JustifySelfType = 'center' | 'start' | 'end' | 'normal';

export interface ItemType {
  id: string;
  alignSelf?: AlignSelfType;
  justifySelf?: JustifySelfType;
  span?: number;
}

export interface RowsProps {
  items: ItemType[];
  gap: number;
  distribution: 'evenly' | 'custom';
  Rows?: string;
  width: RowsWidth;
  renderItem: RenderItemFunction<ItemType>;
  styles: Styles;
}
