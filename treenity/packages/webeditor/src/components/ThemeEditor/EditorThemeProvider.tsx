import { SeedThemeEntity } from '@/components/ThemeEditor/seed-theme.entity';

import { TFC } from '@treenity/ui-kit';
import { omitProps } from '@treenity/ui-kit/utils';
import { theme } from 'antd';
import { SeedToken } from 'antd/es/theme/interface';
import styled from '@emotion/styled';
import { createContext, PropsWithChildren, useMemo, useState } from 'react';
import { camelToDash } from '@treenity/js-shared/utils';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';
import { getTypeName } from '@treenity/core';

import { debounce } from '@s-libs/micro-dash';

export const EditorThemeContext = createContext<{
  seed: SeedToken;
  seedVars: string;
  changeSeed: (seed: Partial<SeedToken>) => Promise<void>;
}>(null!);

export const CssVariables = styled('div', omitProps('vars'))<{ vars: string }>`
  ${props => props.vars}
`;

const valueToCss = (value: any) => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
};

const EditorThemeProvider: TFC<{}, PropsWithChildren> = observer(({ node, children }) => {
  let {
    data: seedTheme,
    isLoading,
    mutate,
  } = node.$$.$get(SeedThemeEntity).use({
    suspense: true,
    fallbackData: null,
    onError: async error => {
      // TODO: this is horrible, just a temporary workaround, need to fix creation and getting meta asap.
      if (error.message.includes('not found')) {
        console.log(
          '%cTheme meta not found%c - creating new theme meta and reloading page',
          'color: #ff6b6b; font-weight: bold; font-size: 12px',
          'color: #4dabf7; font-size: 12px',
        );

        const entity = await node.add(
          getTypeName(SeedThemeEntity),
          {
            seed: {},
          },
          'theme.editor',
        );
        mutate();

        return entity;
      }
    },
  });

  const [themeChanges, _setThemeChanges] = useState<Partial<SeedToken>>(seedTheme?.seed || {});

  const debouncedUpdateConfig = useMemo(
    () => debounce((seed: Partial<SeedToken>) => seedTheme?.updateConfig(seed), 1000),
    [seedTheme],
  );

  const setThemeChanges = async (seed: Partial<SeedToken>) => {
    if (!seedTheme) return;
    debouncedUpdateConfig(seed);
    _setThemeChanges(seed);
  };

  // const needTheme = useMemo(() => {
  //   const seed = { ...theme.defaultSeed, ...seedTheme?.seed, ...themeChanges };
  //   const themeValues = theme.defaultAlgorithm(seed);
  //   return {
  //     name: 'default',
  //     key: 'default',
  //     config: {
  //       token: themeValues as any,
  //       appearance: 'light',
  //     },
  //   } satisfies Theme;
  // }, [seedTheme, themeChanges]);
  const [seed, seedVars] = computed(() => {
    const seed = { ...theme.defaultSeed, ...seedTheme?.seed, ...themeChanges };
    const seedVars = Object.entries(seed).map(
      ([key, value]) => `--${camelToDash(key)}: ${valueToCss(value)};`,
    );
    return [seed, seedVars.join('\n')] as [SeedToken, string];
  }).get();
  // }, [seedTheme?.seed, themeChanges]);

  if (isLoading) return 'Loading...';

  // <ThemeProvider
  //   light={needTheme}
  //   dark={needTheme}
  //   setThemeName={() => {}}
  //   storedThemeName="light"
  //   onChange={(themeField, value) => {
  //     setThemeChanges(prev => ({ ...prev, [themeField]: value }));
  //   }}
  // >

  return (
    <EditorThemeContext.Provider value={{ seed, seedVars, changeSeed: setThemeChanges }}>
      {children}
    </EditorThemeContext.Provider>
  );
});

export default EditorThemeProvider;
