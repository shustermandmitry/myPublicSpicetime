import { Button, Icon, Input, TextContent } from '@/components';
import { noSpaces, required, requiredEmail } from '@/utils';
import { FormItem } from '@/widgets';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Form } from 'antd';
import type { FC } from 'react';
import type { ContactFormProps } from '../types';

const ContactFormComponent: FC<ContactFormProps> = ({
  titleForm,
  action,
  variant = 'vertical',
}) => {
  return (
    <Root>
      <Title size={32} fontWeight={700} letterSpacing={-1.28}>
        {titleForm}
      </Title>
      <FormStyled action={action} layout={variant === 'vertical' ? 'vertical' : 'inline'}>
        <FormItemStyled name="name" label={variant === 'vertical' && 'Name'} rules={[required]}>
          <Input
            placeholder="John Smith"
            prefix={<Icon name="user-profile_outlined" />}
            hideRequired
            size="large"
          />
        </FormItemStyled>

        <FormItemStyled
          name="email"
          label={variant === 'vertical' && 'Email'}
          rules={[noSpaces, required, ...requiredEmail]}
        >
          <Input
            placeholder="johnsmith@mail.box"
            prefix={<Icon name="mail_outlined" />}
            hideRequired
            size="large"
          />
        </FormItemStyled>
        <FormItemStyled
          name="phone"
          label={variant === 'vertical' && 'Phone'}
          rules={[noSpaces, required]}
        >
          <Input
            placeholder="+0-000-000-00-00"
            prefix={<Icon name="smartphone-v_outlined" />}
            hideRequired
            size="large"
          />
        </FormItemStyled>
        <FormItemButtonStyled showIndent={variant === 'vertical'}>
          <ButtonStyled
            isBlock={variant === 'horizontal'}
            type="primary"
            htmlType="submit"
            size="large"
          >
            Call me back
          </ButtonStyled>
        </FormItemButtonStyled>
      </FormStyled>
    </Root>
  );
};

const FormStyled = styled(Form)`
  flex-wrap: nowrap;
  width: 100%;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 16px;

    & > div {
      margin-inline-end: 0 !important;
    }
  }
`;

const Root = styled.div`
  padding: 36px 48px;
  background: ${p => p.theme.base400};
  border-radius: 24px;
  min-width: 400px;

  @media (max-width: 500px) {
    padding: 36px;
    min-width: 100%;
  }
`;

const ButtonStyled = styled(Button, omitProps('isBlock'))<{ isBlock: boolean }>`
  margin: 0 auto;
  display: block;

  ${p =>
    p.isBlock &&
    css`
      @media (max-width: 800px) {
        width: 100%;
      }
    `}
`;

const FormItemButtonStyled = styled(FormItem, omitProps('showIndent'))<{ showIndent: boolean }>`
  margin-bottom: 0;
  ${p =>
    p.showIndent
      ? css`
          margin-top: 16px;
        `
      : css`
          margin-inline-end: 0 !important;
        `}
`;

const FormItemStyled = styled(FormItem)`
  margin-bottom: 16px;
  flex: auto !important;

  &&& label {
    &::before {
      content: none !important;
    }

    font-size: 16px;
    font-weight: 600;
    line-height: 140%;
    letter-spacing: -0.32px;
  }
`;

const Title = styled(TextContent)`
  margin-bottom: 12px;
  text-align: center;
  color: ${p => p.theme.colorTextBase};
`;

export default ContactFormComponent;
