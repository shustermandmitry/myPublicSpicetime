/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { RenderItemFunction } from '@/types';
import { Styles } from '@/types/styles';

type AlignSelfType = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'normal';
export type JustifyContentType =
  | 'space-between'
  | 'space-around'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'normal';
export type FlexDirectionType = 'row' | 'column';
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

// Interface definitions
export interface ImageType {
  src: string;
  backgroundPosition: string;
  backgroundSize: string;
}

export interface ItemType {
  id: string;
  minItemWidth?: number;
  height?: string;
  width?: string;
  alignSelf?: AlignSelfType;
}

export interface FlexProps {
  image: ImageType;
  items: ItemType[];
  width: string;
  height: string;
  justifyContent: JustifyContentType;
  flexDirection: FlexDirectionType;
  overflow: OverflowType;
  backgroundColor: string;
  alignItems: AlignItemsType;
  borderRadius: BorderRadiusType;
  gap: string;
  minItemWidth?: number;
  renderItem: RenderItemFunction<ItemType>;
  styles: Styles;
}
