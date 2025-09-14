import Logo from '@/elements/Logo';
import { LogoContainer } from '@/elements/LogoContainer';
import SocialList from '@/elements/SocialList';
import styled from '@emotion/styled';
import { EditorProps } from '../EditorProps';
import FooterMenuList from './components/FooterMenuList';
import type { HorizontalFooterProps } from './types';

const HorizontalFooterTFC: EditorProps<HorizontalFooterProps> = ({
  mergedMeta: { logo, menu, social },
  convertUrl,
}) => {
  return (
    <Root>
      <LogoContainer>
        <Logo logo={logo} />
      </LogoContainer>
      <FooterMenuList list={menu} convertUrl={convertUrl} />
      <SocialList list={social} />
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  padding: 16px;
  gap: 8px;
  display: flex;
  background: ${p => p.theme.colorBgPanel};

  @media (max-width: 860px) {
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 500px) {
  }
`;

export default HorizontalFooterTFC;
