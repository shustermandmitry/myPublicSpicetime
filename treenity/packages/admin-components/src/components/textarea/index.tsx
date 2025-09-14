/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize } from '@treenity/ui-kit/utils';
import { Input as InputAntd, InputProps } from 'antd';
import { TextAreaProps, TextAreaRef } from 'antd/es/input/TextArea';
import React, { forwardRef } from 'react';

export type InputStyledSizeType = InputProps['size'] | 'x-small' | 'x-large';

export interface InputStyledProps extends Omit<TextAreaProps, 'size'> {
  size?: InputStyledSizeType;
}

const OmitTextarea = forwardRef<TextAreaRef, InputStyledProps>(
  ({ size = 'middle', ...restProps }, ref) => {
    return <InputAntd.TextArea ref={ref} size={normalizeComponentSize(size)} {...restProps} />;
  },
);

const Textarea = styled(OmitTextarea)<{
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'] | BigInt;
}>`
  &,
  &::placeholder {
    font-weight: 500;
    line-height: 140%;
    letter-spacing: -0.32px;
  }

  ${p =>
    p.size === 'x-large' &&
    css`
      border-radius: 12px;
      padding: 7px 12px;

      &,
      &::placeholder {
        font-size: 16px;
      }
    `};

  ${p =>
    p.size === 'large' &&
    css`
      border-radius: 8px;
      padding: 4px 12px;

      &,
      &::placeholder {
        font-size: 16px;
      }
    `};

  ${p =>
    (!p.size || p.size === 'middle') &&
    css`
      border-radius: 6px;
      padding: 4px 10px;

      &,
      &::placeholder {
        font-size: 14px;
      }
    `};

  ${p =>
    p.size === 'small' &&
    css`
      border-radius: 4px;
      padding: 4px 8px;

      &,
      &::placeholder {
        font-size: 12px;
      }
    `};

  ${p =>
    p.size === 'x-small' &&
    css`
      border-radius: 4px;
      padding: 4px 6px;

      &,
      &::placeholder {
        font-size: 10px;
      }
    `};
`;

export default Textarea;
