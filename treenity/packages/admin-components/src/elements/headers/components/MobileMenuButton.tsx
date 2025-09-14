import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import ContextMenu, { IContextButtons } from '@/widgets/ContextMenu';
import styled from '@emotion/styled';
import { useNavigate } from '@remix-run/react';
import { Popover } from 'antd';
import React, { FC } from 'react';
import type { IHeaderMenuList } from '../types';

interface MobileMenuButtonProps {
  menu: IHeaderMenuList[];
}

const MobileMenuButton: FC<MobileMenuButtonProps> = ({ menu }) => {
  const navigate = useNavigate();

  const items: IContextButtons[] = menu.map((menuItem, index) => ({
    title: menuItem.label,
    onClick: () => navigate(menuItem.link),
  }));

  return (
    <Root id="mobile-menu">
      <Popover
        //@ts-ignore
        getPopupContainer={() => document.getElementById('mobile-menu')}
        placement="bottomRight"
        trigger="click"
        content={() => <ContextMenu list={items} />}
      >
        <ButtonWithIcon type="text" icon={<Icon name="menu_outlined" color="colorTextBase" />} />
      </Popover>
    </Root>
  );
};

const Root = styled.div`
  display: none;

  @media (max-width: 860px) {
    display: block;
  }
`;

export default MobileMenuButton;
