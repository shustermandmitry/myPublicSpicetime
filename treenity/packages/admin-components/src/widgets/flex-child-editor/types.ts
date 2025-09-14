import type { AlignmentType } from '@/widgets/grid-children-editor/types';
import { ReactNode } from 'react';

export type FlexChildSizingType = 'shrink' | 'grow' | 'none' | 'customize';

export type FlexChildSizingListType = {
  icon: ReactNode;
  value: FlexChildSizingType;
};

export interface IFlexChildValue {
  sizing: FlexChildSizingValue;
  align: AlignmentType;
  order?: number | string | null;
}

export interface FlexChildSizingValue {
  shrink: number | string | null;
  grow: number | string | null;
  basis?: string;
}

export interface FlexChildSizingProps {
  value?: FlexChildSizingValue;
  onChange?(value: FlexChildSizingValue): void;
}

export interface FlexChildProps {
  value?: IFlexChildValue;
  onChange?(value: IFlexChildValue): void;
}
