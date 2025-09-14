/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Theme } from '../types';

export interface IThemeContext {
  themeName: string;
  themes: Theme[];
  setTheme(theme: string): void;
  onChange?: (themeField: string, value: any) => void;
}
