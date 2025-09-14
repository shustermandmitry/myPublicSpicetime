import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import Title from '../components/Title';
import { EditorProps } from '../EditorProps';
import ContactFormComponent from './components/ContactFormComponent';
import type { ContactFormSectionProps } from './types';

const HorizontalContactForm: EditorProps<ContactFormSectionProps> = ({
  mergedMeta: { title, text, titleForm, action, backgroundColor },
}) => {
  return (
    <Root backgroundColor={backgroundColor}>
      <Flex>
        <Title>{title}</Title>
        <TextContentStyled size={20} fontWeight={500} letterSpacing={-0.8} lineHeight={1.5}>
          {text}
        </TextContentStyled>
      </Flex>
      <FormContainer>
        <ContactFormComponent titleForm={titleForm} action={action} variant="horizontal" />
      </FormContainer>
    </Root>
  );
};

const TextContentStyled = styled(TextContent)`
  color: ${p => p.theme.colorTextBase};
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;

  @media (max-width: 800px) {
    text-align: center;
  }
`;

const FormContainer = styled(Flex)`
  align-items: center;
  justify-content: start;

  & > div {
    width: 100%;
  }
`;

const Root = styled('div', omitProps('backgroundColor'))<{ backgroundColor?: string }>`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 48px;
  padding: 64px;
  min-height: 640px;

  ${p =>
    p.backgroundColor &&
    css`
      background-color: ${(p.theme as any)?.token[p.backgroundColor] || p.backgroundColor};
    `};

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    min-height: auto;
    padding: 36px;
  }
`;

export default HorizontalContactForm;
