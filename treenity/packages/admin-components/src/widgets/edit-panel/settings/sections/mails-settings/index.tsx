/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Switch from '@/components/switch';
import Textarea from '@/components/textarea';
import ChangeEmailInput from '@/widgets/change-email-input';
import FormItem from '@/widgets/form-item';
import PanelItem from '@/widgets/panel-item';
import styled from '@emotion/styled';
import { Form } from 'antd';
import React, { FC } from 'react';
import { IMailsSettingsValues, MailsSettingsProps } from './types';

export const defaultValueMailsSettings: IMailsSettingsValues = {
  acceptingApplications: false,
  email: 'example@example.com',
};

const MailsSettings: FC<MailsSettingsProps> = ({ onChange, value }) => {
  return (
    <Root>
      <FormStyled initialValues={value} onFinish={onChange}>
        <PanelItemStyled label="Accepting applications enabled">
          <FormItem name="acceptingApplications" valuePropName="checked">
            <Switch size="small" />
          </FormItem>
        </PanelItemStyled>
        <PanelItem label="Email for reply">
          <FormItem name="email">
            <ChangeEmailInput />
          </FormItem>
        </PanelItem>
        <PanelItem label="Reply template">
          <FormItem>
            <Textarea autoSize={{ minRows: 4 }} size="x-small" placeholder="Email text" />
          </FormItem>
        </PanelItem>
      </FormStyled>
    </Root>
  );
};

const PanelItemStyled = styled(PanelItem)`
  & > p {
    flex: 1;
  }

  & > div {
    flex: 0;
  }
`;

const FormStyled = styled(Form<IMailsSettingsValues>)`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .ant-form-item-control-input {
    min-height: initial;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
`;

export default MailsSettings;
