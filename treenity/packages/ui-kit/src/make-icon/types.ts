import { CSSProperties } from 'react';
import '../emotion';

export type IconThemesMap = 'default' | 'danger' | 'gray' | 'primary' | string;

export type IconNames = readonly string[];

export interface IIcon<T extends IconNames> {
  name: T[number];
  color?: IconThemesMap;
  className?: string;
  style?: CSSProperties;
  styleIcon?: CSSProperties;
  rotate?: number; // angle to rotate icon to
  spin?: boolean | number; // boolean or number of seconds to make full rotation
}

export interface IErrorProps<T extends IconNames> {
  name: T[number];
  isIconStyle: boolean;
  includeIcon: boolean;
}
