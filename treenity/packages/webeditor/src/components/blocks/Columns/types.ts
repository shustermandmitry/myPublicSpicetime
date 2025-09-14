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

export type ColumnsWidth = 'auto' | '100%' | 'min' | 'max';

type AlignSelfType = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'normal';

type JustifySelfType = 'center' | 'start' | 'end' | 'normal';

/**
 * @title Item
 * @default {"alignSelf": "center", "justifySelf": "center" }
 * */
export interface ItemType {
  alignSelf?: AlignSelfType;
  justifySelf?: JustifySelfType;
  span?: number;
  columnStart?: number;
  columnEnd?: number;
  rowStart?: number;
  rowEnd?: number;
}

export interface ColumnsProps {
  items: ItemType[];
  gap: number;
  distribution: 'evenly' | 'custom';
  columns?: string;
  rows?: string;
  width: ColumnsWidth;
  renderItem: RenderItemFunction<{ id: string }>;
  styles: Styles;
}
