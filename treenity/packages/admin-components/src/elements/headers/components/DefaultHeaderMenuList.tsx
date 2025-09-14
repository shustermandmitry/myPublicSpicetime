import { TextContent } from '@/components/typography';
import styled from '@emotion/styled';
import { Link } from '@remix-run/react';
import type { FC } from 'react';
import type { IHeaderMenuProps } from '../types';

interface DefaultHeaderMenuProps {
  list: IHeaderMenuProps[];
}

const DefaultHeaderMenuList: FC<DefaultHeaderMenuProps> = ({ list, ...restProps }) => {
  return (
    <Root {...restProps}>
      {list.map((menuItem, index) => (
        <LinkString key={index} to={menuItem.link}>
          <TextContent size={12} fontWeight={600}>
            {menuItem.label}
          </TextContent>
        </LinkString>
      ))}
    </Root>
  );
};

const LinkString = styled(Link)`
  color: ${p => p.theme.colorText};
  text-decoration: none;
`;

const Root = styled.div`
  flex: 1;
  display: flex;
  gap: 42px;
`;

export default DefaultHeaderMenuList;
