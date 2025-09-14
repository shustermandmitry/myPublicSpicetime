import Icon from '@/components/icon';
import styled from '@emotion/styled';
import { IThemeContext } from '@treenity/ui-kit/theme';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';

export interface ITheme extends Omit<IThemeContext, 'themes'> {}

const SwitchTheme: FC<ITheme> = ({ setTheme, themeName }) => {
  return (
    <Root>
      <Light themeName={themeName} onClick={() => setTheme('light')}>
        <Icon name="sun_filled" />
      </Light>
      <Dark onClick={() => setTheme('dark')}>
        <Icon name="moon_filled" />
      </Dark>
      <Selection themeName={themeName} />
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  background-color: ${p => p.theme.colorBgContainer};
  border: 1px solid ${p => p.theme.colorBorder};
  height: 24px;
  width: 48px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &,
  i {
    transition:
      background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
  }

  i {
    font-size: 12px !important;
  }
`;

const Selection = styled('div', omitProps('themeName'))<{ themeName?: string }>`
  position: absolute;
  left: ${p => (p.themeName === 'light' ? 0 : 24)}px;
  top: 0;
  width: 24px;
  height: 100%;
  background-color: ${p => p.theme.colorPrimary};
  z-index: 0;
  transition: left 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`;

const Option = styled.div`
  height: 100%;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Light = styled(Option, omitProps('themeName'))<{ themeName?: string }>`
  color: ${p => (p.themeName === 'light' ? p.theme.colorBgContainer : p.theme.colorText)};
  cursor: ${p => (p.themeName === 'light' ? 'inherit' : 'pointer')};
`;

const Dark = styled(Option, omitProps('themeName'))<{ themeName?: string }>`
  color: ${p => (p.themeName === 'dark' ? p.theme.colorBgContainer : p.theme.colorText)};
  cursor: ${p => (p.themeName === 'dark' ? 'inherit' : 'pointer')};
`;

export default SwitchTheme;
