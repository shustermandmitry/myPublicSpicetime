/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Theme as ETheme, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ConfigProvider, theme } from 'antd';
import React, { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { MergedTokens, Theme } from '../types';
import { IThemeContext } from './types';
import { Locale } from 'antd/es/locale';

const { useToken } = theme;

export const ThemeContext: React.Context<IThemeContext> = createContext<IThemeContext>(null!);
export const useCurrentTheme = () => useContext(ThemeContext);

// type Themes = { [key: string]: ThemeConfig };
// const THEMES: Themes = {
//   light: lightTheme,
//   dark: darkTheme,
// };

const InnerThemeProvider: FC<PropsWithChildren<Omit<IThemeContext, 'theme'>>> = ({
  themeName,
  setTheme,
  themes,
  children,
  onChange,
}) => {
  const token = useToken();
  const emotionTheme = useMemo(
    () =>
      ({
        ...token.token,
        //@ts-ignore
        token: token.token as MergedTokens,
      }) as ETheme,
    [token],
  );

  return (
    <ThemeContext.Provider value={{ themeName, setTheme, themes, onChange }}>
      <EmotionThemeProvider theme={emotionTheme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

const configProviderWave = { disabled: true };

const getPopupContainer = (triggerNode?: HTMLElement) => triggerNode?.parentNode as HTMLElement;

export const ThemeProvider: FC<
  PropsWithChildren<{
    light: Theme;
    dark: Theme;
    storedThemeName: string;
    setThemeName(themeName: string): void;
    onChange?: (themeField: string, value: any) => void;
    locale?: Locale;
  }>
> = ({ children, light, dark, setThemeName, storedThemeName, locale, onChange }) => {
  const { theme, themes } = useMemo(() => {
    const sourceTheme = storedThemeName === 'dark' ? dark : light;

    const theme: any = sourceTheme.config;
    theme.algorithm = sourceTheme.config.algorithm;

    const themes = [light, dark];

    const currentTheme = themes.find(theme => theme.name === storedThemeName) || themes[0];
    if (storedThemeName != currentTheme.name) {
      setThemeName(currentTheme.name);
    }

    return { theme, themes };
  }, [dark.config, light.config, storedThemeName]);

  return (
    <ConfigProvider
      wave={configProviderWave}
      //@ts-ignore
      theme={theme}
      getPopupContainer={getPopupContainer}
      locale={locale}
    >
      <InnerThemeProvider
        themeName={storedThemeName}
        setTheme={setThemeName}
        themes={themes}
        children={children}
        onChange={onChange}
      />
    </ConfigProvider>
  );
};
