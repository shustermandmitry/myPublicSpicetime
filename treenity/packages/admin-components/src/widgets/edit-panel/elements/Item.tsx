/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import type { IconNamesMap } from '@/components/icon/icon-component/types';
import styled from '@emotion/styled';
import { FC } from 'react';

export interface ElementItemProps {
  image?: string;
  title: string;
  name: string;
  icon?: IconNamesMap;
  divider?: boolean;
}

const ElementItem: FC<ElementItemProps> = ({ image, title, icon }) => {
  return (
    <Root>
      <Content>
        {image ? <Image src={image} alt={title} /> : icon ? <Icon name={icon} /> : null}
      </Content>
      <Text>{title}</Text>
    </Root>
  );
};

const Image = styled.img`
  background-position: center;
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  color: ${p => p.theme.colorTextBase};
  font-size: 10px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.2px;
  text-align: center;
`;

const Content = styled.div`
  border-radius: 4px;
  background-color: ${p => p.theme.base400};
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &&& i {
    font-size: 22px;
    color: ${p => p.theme.base};
  }
`;

const Root = styled.div`
  border-radius: 8px;
  border: 1px solid ${p => p.theme.gray400};
  background: ${p => p.theme.colorBgContainer};
  padding: 3px;
  height: 70px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export default ElementItem;
