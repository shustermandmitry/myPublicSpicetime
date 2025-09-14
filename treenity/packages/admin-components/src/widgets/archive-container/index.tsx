import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import styled from '@emotion/styled';
import React, { FC, PropsWithChildren } from 'react';

interface ArchiveContainerProps {
  title: string;
}

const ArchiveContainer: FC<PropsWithChildren<ArchiveContainerProps>> = ({ title, children }) => {
  return (
    <Root>
      <Header>
        <Title>{title}</Title>
        <ButtonWithIcon type="secondary-filled" icon={<Icon name="arrow-rotate-right_outlined" />}>
          Recovery all files
        </ButtonWithIcon>
        <Divider />
        <ButtonWithIcon danger type="secondary-filled" icon={<Icon name="trash_outlined" />}>
          Recovery all files
        </ButtonWithIcon>
      </Header>
      <Content>{children}</Content>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.p`
  margin: 0;
  white-space: nowrap;
  font-size: 20px;
  font-weight: 700;
  line-height: 140%;
  letter-spacing: -0.8px;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${p => p.theme.gray400};
`;

const Content = styled.div`
  padding-block: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  gap: 12px;
`;

export default ArchiveContainer;
