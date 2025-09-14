/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import { IconNamesMap } from '@/components/icon/icon-component/types';
import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Space } from 'antd';
import { FC } from 'react';

export interface IContextButtons {
  title: string;
  subTitle?: string;
  icon?: IconNamesMap;
  danger?: boolean;
  onClick(): void;
}

export interface IContextMenu {
  list: IContextButtons[];
}

const ContextMenu: FC<IContextMenu> = ({ list }) => {
  return (
    <SpaceContextMenu size={2} direction="vertical">
      {list.map((button, index: number) => (
        <ButtonStyled
          key={index}
          type="secondary-filled"
          size="small"
          icon={button.icon && <Icon name={button.icon} />}
          danger={button.danger}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            button.onClick();
          }}
        >
          <TextContent size={10} fontWeight={700} letterSpacing={-0.2} lineHeight={1.4}>
            {button.title}
          </TextContent>
        </ButtonStyled>
      ))}
    </SpaceContextMenu>
  );
};

const SpaceContextMenu = styled(Space)`
  width: 100%;
  min-width: 150px;

  button {
    width: 100%;

    span {
      text-align: start;
    }
  }
`;

const ButtonStyled = styled(ButtonWithIcon)<{ danger?: boolean }>`
  ${p =>
    !p.danger &&
    css`
      &:not(:hover):not(:active) {
        background: transparent !important;
      }
    `}
  & > span {
    align-items: center;
    gap: 4px;
  }
`;

export default ContextMenu;
