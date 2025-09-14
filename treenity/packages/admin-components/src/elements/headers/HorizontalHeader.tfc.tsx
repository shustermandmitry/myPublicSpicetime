import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import { Link } from '@remix-run/react';
import { EditorProps } from '../EditorProps';
import Logo from '../Logo';
import SocialList from '../SocialList';
import MobileMenuButton from './components/MobileMenuButton';
import type { HorizontalHeaderProps } from './types';

const HorizontalHeader: EditorProps<HorizontalHeaderProps> = ({
  mergedMeta: { logo, menu, social },
  convertUrl,
}) => {
  const convertedMenu = convertUrl.array(menu) as typeof menu;
  const halfList = Math.ceil(convertedMenu.length / 2);
  const firstHalfList = convertedMenu.slice(0, halfList);
  const secondHalfList = convertedMenu.slice(halfList);
  return (
    <Root>
      <Container>
        <LeftSide>
          {firstHalfList.map((menuItem, index) => (
            <LinkString to={menuItem.link} key={`${menuItem.label}-first-${index}`}>
              <TextContent size={12} fontWeight={600}>
                {menuItem.label}
              </TextContent>
            </LinkString>
          ))}
        </LeftSide>
        <Logo logo={logo} />
        <RightSide>
          <RightMenu>
            {secondHalfList.map((menuItem, index) => (
              <LinkString to={menuItem.link} key={`${menuItem.label}-second-${index}`}>
                <TextContent size={12} fontWeight={600}>
                  {menuItem.label}
                </TextContent>
              </LinkString>
            ))}
          </RightMenu>
          <SocialList list={social} />
        </RightSide>
      </Container>
      <MobileMenuButton menu={convertedMenu} />
    </Root>
  );
};

const Container = styled.div`
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

const FlexStyle = styled.div`
  display: flex;
  gap: 42px;
  flex: 1;
`;

const RightMenu = styled(FlexStyle)`
  justify-content: start;
`;

const LeftSide = styled(FlexStyle)`
  justify-content: end;

  @media (max-width: 860px) {
    display: none;
  }
`;

const RightSide = styled(FlexStyle)`
  display: flex;
  justify-content: space-between;

  @media (max-width: 860px) {
    display: none;
  }
`;

const LinkString = styled(Link)`
  color: ${p => p.theme.colorText};
  text-decoration: none;
`;

const Root = styled.div`
  padding: 0 16px;
  background: ${p => p.theme.base500};
  display: flex;
  align-items: center;
`;

export default HorizontalHeader;
