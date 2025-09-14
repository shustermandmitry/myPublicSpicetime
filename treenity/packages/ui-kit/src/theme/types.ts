/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { ThemeConfig as AntdThemeConfig } from 'antd';
import { Theme as AntdTheme } from 'antd-token-previewer';
import { AdditionalTokens } from './additional-tokens';

export type MergedTokens = AntdThemeConfig['token'] & AdditionalTokens;
export type MergedTokensComponents<T = {}> = MergedTokens &
  AntdThemeConfig['components'] & {
    token: MergedTokens & T;
  } & T;

export type MergedConfig = Omit<AntdThemeConfig, 'token'> & {
  token: MergedTokens;
  appearance: string;
};
export type ThemeConfig = MergedConfig;

export type Theme = Omit<AntdTheme, 'config'> & {
  config: MergedConfig;
};
