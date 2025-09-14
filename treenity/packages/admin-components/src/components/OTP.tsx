/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize, omitProps } from '@treenity/ui-kit/utils';
import type { GetProps } from 'antd';
import { Input } from 'antd';
import { OTPRef } from 'antd/es/input/OTP';
import React, { forwardRef, useLayoutEffect } from 'react';

type OTPProps = GetProps<typeof Input.OTP>;

export type OPTStyledSize = OTPProps['size'] | 'x-small' | 'x-large';

interface OPTStyledProps extends Omit<OTPProps, 'size'> {
  size?: OPTStyledSize;
}

const OTP = forwardRef<OTPRef, OPTStyledProps>(
  ({ size = 'middle', className, ...restProps }, ref) => {
    // Hack due to AntD doesn't have this functionality
    useLayoutEffect(() => {
      const code = document.querySelector('.ant-otp');
      if (code) {
        const inputs = code.querySelectorAll('input');
        inputs.forEach(input => input.setAttribute('placeholder', '_'));
      }
    }, []);

    return (
      <Root size={size} className={className}>
        <Input.OTP ref={ref} size={normalizeComponentSize(size)} {...restProps} />
      </Root>
    );
  },
);

const Root = styled('div', omitProps('size'))<{ size: OPTStyledSize }>`
  input {
    background-color: ${p => p.theme.colorBgBase};
    transition:
      color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
      border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

    &::selection {
      background: transparent;
    }

    &:hover {
      border-color: ${p => p.theme.colorPrimary};
    }
  }

  ${p =>
    p.size === 'x-large' &&
    css`
      & > div {
        column-gap: 10px;
      }

      input {
        border-radius: 12px;
        height: 48px;
        width: 48px;
        font-size: 16px;
        font-weight: 500;
      }
    `};

  ${p =>
    p.size === 'x-small' &&
    css`
      & > div {
        column-gap: 2px;
      }

      input {
        border-radius: 4px;
        height: 20px;
        width: 20px;
        font-size: 10px;
        font-weight: 500;
      }
    `};
`;

export default OTP;
