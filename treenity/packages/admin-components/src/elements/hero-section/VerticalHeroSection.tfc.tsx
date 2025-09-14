import getBackgroundImageUrl from '@/utils/uploader/get-image-type';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { EditorProps } from '../EditorProps';
import Subtitle from './components/Subtitle';
import Text from './components/Text';
import Title from './components/Title';
import type { VerticalHeroSectionProps } from './types';

const VerticalHeroSection: EditorProps<VerticalHeroSectionProps> = ({
  mergedMeta: {
    backgroundImage,
    subtitle,
    title,
    text,
    backgroundColor,
    isReversedLayout = false,
    titleTag,
  },
}) => {
  return (
    <Root backgroundColor={backgroundColor} isReversedLayout={isReversedLayout}>
      <Content isReversedLayout={isReversedLayout}>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {title && <Title as={titleTag}>{title}</Title>}
        {text && <Text>{text}</Text>}
      </Content>
      <ImageContainer backgroundImage={getBackgroundImageUrl(backgroundImage)} />
    </Root>
  );
};

const ImageContainer = styled('div', omitProps('backgroundImage'))<{
  backgroundImage?: string;
}>`
  ${p =>
    p.backgroundImage &&
    css`
      background-image: url(${p.backgroundImage});
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    `}
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Content = styled(Flex, omitProps('isReversedLayout'))<{
  isReversedLayout?: boolean;
}>`
  text-align: center;

  ${p =>
    p.isReversedLayout &&
    css`
      order: 1;
    `};
`;

const Root = styled('div', omitProps('backgroundColor', 'isReversedLayout'))<{
  backgroundColor?: string;
  isReversedLayout?: boolean;
}>`
  display: grid;
  grid-template-rows: 1fr 640px;
  gap: 64px;
  padding: 64px;

  ${p =>
    p.backgroundColor &&
    css`
      background-color: ${(p.theme as any)?.token[p.backgroundColor] || p.backgroundColor};
    `};

  ${p =>
    p.isReversedLayout &&
    css`
      grid-template-rows: 640px 1fr;
    `};

  @media (max-width: 800px) {
    padding: 36px;
    gap: 36px;
  }
`;

export default VerticalHeroSection;
