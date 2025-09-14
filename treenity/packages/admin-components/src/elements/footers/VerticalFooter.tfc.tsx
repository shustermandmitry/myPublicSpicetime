import Logo from '@/elements/Logo';
import { LogoContainer } from '@/elements/LogoContainer';
import styled from '@emotion/styled';
import { EditorProps } from '../EditorProps';
import SocialList from '../SocialList';
import FooterMenuList from './components/FooterMenuList';
import FooterSendEmail from './components/FooterSendEmail';
import type { VerticalFooterProps } from './types';

const VerticalFooterTFC: EditorProps<VerticalFooterProps> = ({
  mergedMeta: { logo, menu, social, onSubmit },
  convertUrl,
}) => {
  return (
    <Root>
      <TopSide>
        <LogoContainerStyled>
          <Logo logo={logo} />
        </LogoContainerStyled>
        <FooterSendEmail onSubmit={onSubmit} />
      </TopSide>
      <BottomSide>
        <FooterMenuList list={menu} convertUrl={convertUrl} />
        <SocialList list={social} />
      </BottomSide>
    </Root>
  );
};

const LogoContainerStyled = styled(LogoContainer)`
  @media (max-width: 860px) {
    max-width: 133px !important;
  }
`;

const BottomSide = styled.div`
  display: flex;

  @media (max-width: 860px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const TopSide = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 36px;

  @media (max-width: 860px) {
    margin-bottom: 24px;
  }

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Social = styled.div`
  display: flex;
  gap: 12px;

  & > a > img {
    width: 16px;
    height: 16px;
  }
`;

const Root = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.colorBgPanel};
`;

export default VerticalFooterTFC;
