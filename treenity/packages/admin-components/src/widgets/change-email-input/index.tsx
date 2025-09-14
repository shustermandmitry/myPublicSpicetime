/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import Input from '@/components/input';
import OTP from '@/components/OTP';
import type { ChangeEmailInputProps } from '@/widgets/change-email-input/types';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { message } from 'antd';
import React, { FC, useCallback, useState } from 'react';

//TODO: Statics
let USER_EMAIL = 'example@example.com';
const VERIFY_CODE = '123456';

const ChangeEmailInput: FC<ChangeEmailInputProps> = ({ onChange, value }) => {
  const [email, setEmail] = useState<string>(value || '');
  const [verifyCode, setVerifyCode] = useState<string | undefined>();
  const [isConfirm, toggleConfirm] = useToggle();

  const onConfirm = useCallback(() => {
    if (verifyCode === VERIFY_CODE) {
      onChange?.(email);
      USER_EMAIL = email;
      toggleConfirm();
      setVerifyCode(undefined);
    } else {
      message.error('Unauthorized');
    }
  }, [verifyCode, VERIFY_CODE]);

  const onCancel = useCallback(() => {
    setEmail(USER_EMAIL);
    setVerifyCode(undefined);
    toggleConfirm();
  }, [USER_EMAIL]);

  return (
    <Root>
      {!isConfirm ? (
        <CheckEmail>
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          {email === USER_EMAIL ? (
            <IconStyled name="success_filled" color="primary" />
          ) : (
            <Button size="x-small" type="primary" onClick={toggleConfirm}>
              Confirm
            </Button>
          )}
        </CheckEmail>
      ) : (
        <CodeContainer>
          <OTPStyled size="x-small" onChange={setVerifyCode} />
          <ButtonWithIcon
            onClick={onConfirm}
            type="primary"
            size="x-small"
            icon={<Icon name="check_outlined" />}
          />
          <ButtonWithIcon
            onClick={onCancel}
            type="primary"
            danger
            size="x-small"
            icon={<Icon name="x-axis_outlined" />}
          />
        </CodeContainer>
      )}
    </Root>
  );
};

const OTPStyled = styled(OTP)`
  &,
  & > div,
  input {
    width: 100%;
  }
`;

const CodeContainer = styled.div`
  display: flex;
  gap: 2px;
  justify-content: end;

  button {
    min-width: 20px;
  }
`;

const Root = styled.div``;

const CheckEmail = styled.div`
  position: relative;
  display: flex;
  gap: 2px;
`;

const IconStyled = styled(Icon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  right: 6px;
`;

export default ChangeEmailInput;
