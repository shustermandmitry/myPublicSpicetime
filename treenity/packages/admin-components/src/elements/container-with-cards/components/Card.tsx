import Button from '@/components/button';
import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import type { FC } from 'react';
import React from 'react';
import { IContainerWithCardsList, IContainerWithCardsType } from '../types';

const Card: FC<IContainerWithCardsList & IContainerWithCardsType> = ({
  image,
  title,
  text,
  showButton,
  buttonText,
  action,
  type,
}) => {
  return (
    <Root type={type}>
      <Image src={image} alt={title} />
      <TitleStyled size={28} fontWeight={700} lineHeight={1.4} letterSpacing={-1.12}>
        {title}
      </TitleStyled>
      <TextStyled
        size={14}
        fontWeight={500}
        lineHeight={1.4}
        letterSpacing={-0.28}
        showButton={showButton}
      >
        {text}
      </TextStyled>
      {showButton && (
        <Button type="primary" onClick={action}>
          {buttonText}
        </Button>
      )}
    </Root>
  );
};

const Root = styled('div', omitProps('type'))<IContainerWithCardsType>`
  padding: 20px;
  border-radius: 16px;
  min-width: 280px;
  background: ${p => p.theme.colorBgBase};

  ${p =>
    p.type === 'horizontal'
      ? css`
          max-width: 310px;
        `
      : css`
          max-width: initial;
        `}
`;

const TitleStyled = styled(TextContent)`
  margin-bottom: 4px;
`;

const TextStyled = styled(TextContent, omitProps('showButton'))<{ showButton: boolean }>`
  ${p =>
    p.showButton
      ? css`
          margin-bottom: 12px;
        `
      : css`
          margin-bottom: 0;
        `}
`;

const Image = styled.img`
  height: 48px;
  width: auto;
  display: block;
  margin-bottom: 35px;
`;

export default Card;
