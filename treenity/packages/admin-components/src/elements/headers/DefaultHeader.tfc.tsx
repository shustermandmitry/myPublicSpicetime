import styled from '@emotion/styled';
import { EditorProps } from '../EditorProps';
import Logo, { ILogoProps } from '../Logo';
import { LogoContainer } from '../LogoContainer';
import SocialList from '../SocialList';
import DefaultHeaderMenuList from './components/DefaultHeaderMenuList';
import MobileMenuButton from './components/MobileMenuButton';
import type { DefaultHeaderProps } from './types';

const DefaultHeader: EditorProps<DefaultHeaderProps> = ({
  mergedMeta: { logo, menu, social },
  convertUrl,
}) => {
  const convertedMenu = convertUrl.array(menu);
  const convertedLogo = convertUrl.object<ILogoProps>(logo);

  return (
    <Root>
      <LogoContainer>
        <Logo logo={convertedLogo} />
      </LogoContainer>
      <DefaultHeaderMenuListStyled list={convertedMenu} />
      <SocialListStyled list={social} />
      <MobileMenuButton menu={convertedMenu} />
    </Root>
  );
};

const DefaultHeaderMenuListStyled = styled(DefaultHeaderMenuList)`
  @media (max-width: 860px) {
    display: none;
  }
`;

const SocialListStyled = styled(SocialList)`
  @media (max-width: 860px) {
    display: none;
  }
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  background: ${p => p.theme.base500};

  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;

export default DefaultHeader;
