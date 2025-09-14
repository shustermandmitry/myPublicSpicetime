import getBackgroundImageUrl from '@/utils/uploader/get-image-type';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { EditorProps } from '../EditorProps';
import Subtitle from './components/Subtitle';
import Text from './components/Text';
import Title from './components/Title';
import type { HeroSectionProps } from './types';

const HeroSection: EditorProps<HeroSectionProps> = ({
  mergedMeta: { backgroundImage, subtitle, title, text, backgroundColor, titleTag },
}) => {
  return (
    <Root backgroundImage={backgroundImage} backgroundColor={backgroundColor}>
      <Content>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {title && <Title as={titleTag}>{title}</Title>}
        {text && <Text>{text}</Text>}
      </Content>
    </Root>
  );
};

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const Content = styled(Flex)`
  max-width: 800px;
`;

const Root = styled(Flex, omitProps('backgroundImage', 'backgroundColor'))<{
  backgroundImage?: string;
  backgroundColor?: string;
}>`
  min-height: 600px;
  padding: 64px;

  ${p =>
    p.backgroundColor &&
    css`
      background-color: ${(p.theme as any)?.token[p.backgroundColor] || p.backgroundColor};
    `};

  ${p =>
    p.backgroundImage &&
    css`
      background-image: url(${getBackgroundImageUrl(p.backgroundImage)});
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    `};

  @media (max-width: 800px) {
    padding: 36px;
  }
`;

export default HeroSection;
