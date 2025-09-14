import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import React from 'react';
import Title from '../components/Title';
import { EditorProps } from '../EditorProps';
import Card from './components/Card';
import type { ContainerWithCardsTFCProps, IContainerWithCardsType } from './types';

const ContainerWithCardsTFC: EditorProps<ContainerWithCardsTFCProps> = ({
  mergedMeta: { title, text, list, type },
}) => {
  return (
    <Root>
      <TitleStyled>{title}</TitleStyled>
      <TextContentStyled size={16} fontWeight={800} lineHeight={1.5}>
        {text}
      </TextContentStyled>
      <Cards type={type}>
        {list.map((item, index) => (
          <Card {...item} type={type} key={`${item.text}-${item.title}-${index}`} />
        ))}
      </Cards>
    </Root>
  );
};

const TitleStyled = styled(Title)`
  text-align: center;
`;

const Root = styled.div`
  padding: 64px;
  background: ${p => p.theme.base400};
`;

const Cards = styled('div', omitProps('type'))<IContainerWithCardsType>`
  gap: 12px;
  margin-bottom: 90px;
  flex-wrap: wrap;
  justify-content: center;
  display: grid;
  ${p =>
    p.type === 'vertical'
      ? css`
          grid-template-columns: 1fr;
        `
      : css`
          grid-template-columns: repeat(auto-fill, 310px);
        `}
`;

const TextContentStyled = styled(TextContent)`
  margin-bottom: 48px;
  text-align: center;
`;

export default ContainerWithCardsTFC;
