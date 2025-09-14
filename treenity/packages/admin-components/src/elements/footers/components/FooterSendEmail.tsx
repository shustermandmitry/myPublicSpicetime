import { Button, Icon, Input } from '@/components';
import { requiredEmail } from '@/utils';
import { FormItem } from '@/widgets';
import styled from '@emotion/styled';
import { Form } from 'antd';
import type { FC } from 'react';
import type { FooterSendEmailProps, FooterSendEmailValue } from '../types';

const FooterSendEmail: FC<FooterSendEmailProps> = ({ onSubmit }) => {
  return (
    <FormStyled layout="inline" onFinish={onSubmit} validateTrigger={[]}>
      <FormItem name="email" rules={requiredEmail} hideRequired>
        <Input size="middle" prefix={<Icon name="mail_outlined" />} placeholder="Email" />
      </FormItem>
      <Form.Item>
        <ButtonStyled type="primary" size="middle">
          Send
        </ButtonStyled>
      </Form.Item>
    </FormStyled>
  );
};

const FormStyled = styled(Form<FooterSendEmailValue>)`
  display: flex;
  gap: 8px;

  .ant-form-item {
    margin: 0;
  }
`;

const ButtonStyled = styled(Button)`
  width: 80px;
`;

export default FooterSendEmail;
