import styled from '@emotion/styled';
import { Link } from '@remix-run/react';
import type { FC } from 'react';
import React from 'react';
import { ConvertUrlApi } from '../../EditorProps';
import type { IFooterMenuList } from '../types';

interface FooterMenuListProps {
  list: IFooterMenuList[];
  convertUrl: ConvertUrlApi;
}

const FooterMenuList: FC<FooterMenuListProps> = ({ list, convertUrl, ...restProps }) => {
  return (
    <Root {...restProps}>
      {list.map((menuItem, index) => (
        <MenuColumn key={`${menuItem.title}-${index}`}>
          <Title>{menuItem.title}</Title>
          {menuItem.list.map(menuColItem => {
            const convertedMenu = convertUrl.string(menuColItem.link);

            return (
              <LinkString
                to={convertedMenu}
                key={`${menuItem.title}-${index}-${menuColItem.title}`}
              >
                <MenuItem>{menuColItem.title}</MenuItem>
              </LinkString>
            );
          })}
        </MenuColumn>
      ))}
    </Root>
  );
};

const LinkString = styled(Link)`
  text-decoration: none;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 140%;
  color: ${p => p.theme.colorPrimary};
  margin-bottom: 4px;
`;

const MenuItem = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  color: ${p => p.theme.colorTextBase};
`;

const MenuColumn = styled.div`
  width: 100%;
  max-width: 290px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 860px) {
    & > div {
      width: fit-content;
    }
  }
`;

const Root = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;

  @media (max-width: 860px) {
    justify-content: space-between;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 24px;
  }
`;

export default FooterMenuList;
