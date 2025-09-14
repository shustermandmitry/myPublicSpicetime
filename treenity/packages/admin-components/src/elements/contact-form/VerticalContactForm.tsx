import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import Title from '../components/Title';
import ContactFormComponent from './components/ContactFormComponent';
import Text from './components/Text';
import type { ContactFormSectionProps } from './types';
import { EditorProps } from '../EditorProps';

const VerticalContactForm: EditorProps<ContactFormSectionProps> = ({
  mergedMeta: { title, text, titleForm, action, backgroundColor },
}) => {
  return (
    <Root backgroundColor={backgroundColor}>
      <Flex>
        <Title>{title}</Title>
        <Text>{text}</Text>
      </Flex>
      <FormContainer>
        <ContactFormComponent titleForm={titleForm} action={action} />
      </FormContainer>
    </Root>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 800px) {
    text-align: center;
  }
`;

const FormContainer = styled(Flex)`
  align-items: center;
`;

const Root = styled('div', omitProps('backgroundColor'))<{ backgroundColor?: string }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  padding: 64px;
  min-height: 512px;

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

export default VerticalContactForm;
