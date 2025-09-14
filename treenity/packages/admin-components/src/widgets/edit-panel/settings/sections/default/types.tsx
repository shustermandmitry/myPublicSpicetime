/*
 * Copyright (c) 2024. Treenity Inc.
 */

export type VisibilityType = 'visible' | 'hidden';

export interface IDefaultSectionValues {
  id: string;
  tag: string;
  visibility: VisibilityType;
}

export interface DefaultSectionProps {
  value: IDefaultSectionValues;
  onChange(value: IDefaultSectionValues): void;
}
