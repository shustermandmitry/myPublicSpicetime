import AnimatedLogo from '@/components/logo/AnimatedLogo';
import { Title } from '@/components/typography';
import styled from '@emotion/styled';
import { types } from '@treenity/core';
import type { FC } from 'react';

const LoaderComponent: FC = ({ ...restProps }) => {
  return (
    <Root {...restProps}>
      <AnimatedLogo size={48} />
      <TitleStyled level={4}>Loading</TitleStyled>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  flex: auto;
  height: 100vh;
  color: ${p => p.theme.colorTextBase};
  background: ${p => p.theme.colorBgBase};
`;

const TitleStyled = styled(Title)`
  text-align: center;
  margin-top: 12px;
  margin-bottom: 0;
`;

export default LoaderComponent;
types.react.add('ui.loader', LoaderComponent);
