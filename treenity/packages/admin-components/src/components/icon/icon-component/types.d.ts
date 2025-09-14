import { CSSProperties } from 'react';
import '../emotion';
import iconNames from './icons-names';

export type IconNamesMap = (typeof iconNames)[number];

interface IIcon {
  name: IconNamesMap;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  spin?: number;
}

export interface IErrorProps {
  name: IconNamesMap;
  isIconStyle: boolean;
  includeIcon: boolean;
}
