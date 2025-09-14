import { IconNamesMap } from '@/components/icon/icon-component/types';
import styled from '@emotion/styled';
import { Space } from 'antd';
import { FC } from 'react';
import Button from '../button';
import Icon from '../icon';

export interface IContextButtons {
  title: string;
  subTitle?: string;
  icon: IconNamesMap;
  danger?: boolean;
  onClick(): void;
}

export interface IContextMenu {
  list: IContextButtons[];
}

const ContextMenu: FC<IContextMenu> = ({ list }) => {
  return (
    <SpaceStyled size={2} direction="vertical">
      {list.map((button, index: number) => (
        <ButtonStyled
          key={index}
          type="text"
          size="small"
          icon={<Icon name={button.icon} color={button.danger ? 'danger' : 'default'} />}
          onClick={e => {
            e.preventDefault();
            button.onClick();
          }}
          danger={button.danger}
        >
          <Text>{button.title}</Text>
        </ButtonStyled>
      ))}
    </SpaceStyled>
  );
};

const SpaceStyled = styled(Space)`
  width: 100%;
  min-width: 150px;
`;

const Text = styled.span`
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.4px;

  &.suffix {
    font-weight: 700;
    font-size: 8px;
    line-height: 8px;
  }
`;

const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;

  :is(i) {
    font-size: 12px;
  }

  i {
    color: ${p => p.theme.colorPrimary} !important;
  }
`;

export default ContextMenu;
