import styled from '@emotion/styled';
import { EditorProps } from '../EditorProps';
import Logo from '../Logo';
import SocialList from '../SocialList';
import ContactsHeader from './components/ContactsHeader';
import DefaultHeaderMenuList from './components/DefaultHeaderMenuList';
import MobileMenuButton from './components/MobileMenuButton';
import type { VerticalHeaderProps } from './types';

const VerticalHeader: EditorProps<VerticalHeaderProps> = ({
  mergedMeta: { logo, menu, social, contacts },
  convertUrl,
}) => {
  const convertedMenu = convertUrl.array(menu);
  return (
    <Root>
      <TopSide>
        <ContactsHeaderStyled contacts={contacts} />
        <Logo logo={logo} />
        <SocialListStyled list={social} />
      </TopSide>
      <DefaultHeaderMenuListStyled list={convertedMenu} />
      <MobileMenuButton menu={convertedMenu} />
    </Root>
  );
};

const ContactsHeaderStyled = styled(ContactsHeader)`
  @media (max-width: 860px) {
    display: none;
  }
`;

const SocialListStyled = styled(SocialList)`
  @media (max-width: 860px) {
    display: none;
  }
`;

const DefaultHeaderMenuListStyled = styled(DefaultHeaderMenuList)`
  height: 32px;
  min-height: 32px;

  @media (max-width: 860px) {
    display: none;
  }
`;

const TopSide = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  height: 60px;

  @media (max-width: 860px) {
    justify-content: center;
    flex: 1;
    padding-left: 32px;
  }
`;

const Root = styled.div`
  padding: 0 16px;
  background: ${p => p.theme.base500};
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: 860px) {
    flex-direction: row;
  }
`;

export default VerticalHeader;
