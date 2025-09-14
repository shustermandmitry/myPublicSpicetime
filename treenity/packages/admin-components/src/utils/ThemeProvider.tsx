/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { setCookie, useCookie } from '@treenity/repository/client';
import { TreeNode, useTree } from '@treenity/tree-api';
import { useStorage } from '@treenity/ui-kit/hooks';
import { Theme, ThemeEntity, ThemeProvider } from '@treenity/ui-kit/theme';
import React, { FC, PropsWithChildren } from 'react';
import useSWR from 'swr';

const defaultThemeName = 'light';

function useLoadTheme(name: string): Theme | undefined {
  const treeApi = useTree();
  const { data: themeNode } = treeApi.useNode(`/sys/themes/${name}`);
  const { data } = useSWR(`${name}-theme` + (themeNode as any)?.$id, () =>
    (themeNode as TreeNode)?.get(ThemeEntity),
  );
  return data;
}

const ThemeProviderLoader: FC<PropsWithChildren> = ({ children }) => {
  const lightTheme = useLoadTheme('light');
  const darkTheme = useLoadTheme('dark');

  const cookies = useCookie();
  const [storedThemeName, _setThemeName] = useStorage<string>(
    'theme',
    cookies.theme || defaultThemeName,
  );
  const setThemeName = (theme: string) => {
    setCookie('theme', theme, 365 * 24 * 60 * 60);
    _setThemeName(theme);
  };

  if (!lightTheme || !darkTheme) return null;

  return (
    <ThemeProvider
      light={lightTheme}
      dark={darkTheme}
      children={children}
      storedThemeName={storedThemeName}
      setThemeName={setThemeName}
    />
  );
};

export default ThemeProviderLoader;
