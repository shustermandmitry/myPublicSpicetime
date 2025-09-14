/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';

interface PageNotFoundProps {
  onClickHome?(): void;
  onClickBack?(): void;
  backgroundImage?: string;
  mailLink?: string;
  logoText?: string;
  logo?: string;
}

const PageNotFound: FC<PageNotFoundProps> = ({
  backgroundImage,
  logo,
  onClickHome,
  onClickBack,
  mailLink,
  logoText,
}) => {
  return (
    <Root backgroundImage={backgroundImage}>
      <Content>
        <LogoWrap>
          <img src={logo} alt="logo" />
          {logoText && (
            <TextContent size={36} fontWeight={800}>
              {logoText}
            </TextContent>
          )}
        </LogoWrap>
        <CenterBox>
          <Title>404</Title>
          <TextBlock>
            <Subtitle size={32} fontWeight={600}>
              Ooops, your projects are not here :(
            </Subtitle>
            <TextStyled size={20} fontWeight={400}>
              This page is missing or you assembled <br />
              the link incorrectly.
            </TextStyled>
          </TextBlock>
          <ButtonsContainer>
            {!!onClickBack && (
              <Button
                type="secondary-outlined"
                size="x-large"
                block
                icon={<Icon name="arrow-left_outlined" />}
                onClick={onClickBack}
              >
                Back
              </Button>
            )}
            {!!onClickHome && (
              <Button
                type="primary"
                size="x-large"
                block
                suffix={<Icon name="arrow-right_outlined" />}
                onClick={onClickHome}
              >
                Home
              </Button>
            )}
          </ButtonsContainer>
        </CenterBox>
        {mailLink && (
          <Footer>
            Do you have any problems?
            <br />
            Contact us{' '}
            <a target="_blank" href={mailLink}>
              {mailLink}
            </a>
          </Footer>
        )}
      </Content>
    </Root>
  );
};

const Root = styled('div', omitProps('backgroundImage'))<{ backgroundImage?: string }>`
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  color: ${p => p.theme.colorTextBase};
  background: ${p => p.theme.colorBgBase};

  a {
    color: ${p => p.theme.colorPrimary};
  }

  ${p =>
    p.backgroundImage &&
    css`
      background: url(${p.backgroundImage}) no-repeat ${p.theme.colorBgBase};
      background-position: center;
      background-size: cover;
    `}
`;

const Content = styled.div`
  max-width: 600px;
  padding-top: 40px;
  padding-bottom: 12px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrap = styled.div`
  gap: 16px;
  display: flex;
  align-items: center;

  img {
    width: 48px;
  }
`;

const Title = styled.h1`
  font-size: 160px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: -9.6px;
  margin: 0;

  @media (max-width: 576px) {
    font-size: 96px;
  }
`;

const Subtitle = styled(TextContent)`
  @media (max-width: 576px) {
    font-size: 20px;
  }
`;

const TextStyled = styled(TextContent)`
  @media (max-width: 576px) {
    font-size: 16px;
  }
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  min-width: 328px;

  button {
    max-width: 160px;
  }
`;

const Footer = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
`;

export default PageNotFound;
