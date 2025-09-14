import iconObject from '@/components/icon/icon-component/icons-object';
import requiredFieldMarker from '@/components/RequiredFieldMarker';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize, omitProps } from '@treenity/ui-kit/utils';
import { Input as InputAntd, InputProps, InputRef } from 'antd';
import React, { forwardRef } from 'react';

export type InputStyledSize = InputProps['size'] | 'x-small' | 'x-large';

export interface InputStyledProps extends Omit<InputProps, 'size'> {
  size?: InputStyledSize;
}

const OmitInput = forwardRef<InputRef, InputStyledProps>(
  ({ size = 'middle', ...restProps }, ref) => {
    return <InputAntd ref={ref} size={normalizeComponentSize(size)} {...restProps} />;
  },
);

const Input = styled(OmitInput, omitProps('hideRequired'))<{
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'] | BigInt;
  hideRequired?: boolean;
}>`
  &&& > input:-webkit-autofill,
  &&& > input:-webkit-autofill:hover,
  &&& > input:-webkit-autofill:focus,
  &&& > input:-webkit-autofill:active {
    -webkit-text-fill-color: ${p => p.theme.colorTextBase} !important; /* Цвет текста */
    -webkit-box-shadow: 0 0 0 30px ${p => p.theme.colorBgContainer} inset !important;
  }

  &&& > input[disabled]:-webkit-autofill,
  &&& > input[disabled]:-webkit-autofill:hover,
  &&& > input[disabled]:-webkit-autofill:focus,
  &&& > input[disabled]:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${p => p.theme.colorBgContainerDisabled} inset !important;
  }

  transition:
    background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    border 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;

  ${p => css`
    ${p.size === 'x-large' &&
    css`
      height: ${p.theme.Input.controlHeightXL}px;
      font-size: ${p.theme.Input.inputFontSizeXL}px;
      border-radius: ${p.theme.Input.borderRadiusXL}px;
      padding-inline: ${p.theme.Input.paddingInlineXL}px;

      && i {
        font-size: 20px;
      }
    `};

    ${p.size === 'large' &&
    css`
      height: ${p.theme.Input.controlHeightLG}px;
      font-size: ${p.theme.Input.inputFontSizeLG}px;
      border-radius: ${p.theme.Input.borderRadiusLG}px;
      padding-inline: ${p.theme.Input.paddingInlineLG}px;

      && i {
        font-size: 20px !important;
      }
    `};

    ${(!p.size || p.size === 'middle') &&
    css`
      height: ${p.theme.Input.controlHeight}px;
      font-size: ${p.theme.Input.inputFontSize}px;
      border-radius: ${p.theme.Input.borderRadius}px;
      padding-inline: ${p.theme.Input.paddingInline}px;

      && i {
        font-size: 16px !important;
      }
    `};

    ${(!p.size || p.size === 'small') &&
    css`
      height: ${p.theme.Input.controlHeightSM}px;
      font-size: ${p.theme.Input.inputFontSizeSM}px;
      border-radius: ${p.theme.Input.borderRadiusSM}px;
      padding-inline: ${p.theme.Input.paddingInlineSM}px;

      && .ant-input-prefix {
        margin-inline-end: 6px;
      }

      && i {
        font-size: 14px !important;
      }
    `};

    ${(!p.size || p.size === 'x-small') &&
    css`
      height: ${p.theme.Input.controlHeightXS}px;
      font-size: ${p.theme.Input.inputFontSizeXS}px;
      border-radius: ${p.theme.Input.borderRadiusXS}px;
      padding-inline: ${p.theme.Input.paddingInlineXS}px;
      padding-block: 0;

      && .ant-input-prefix {
        margin-inline-end: 6px;
      }

      && i {
        font-size: 12px !important;
      }
    `};
  `};

  &[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    display: none;
  }

  &.ant-input {
    font-weight: 500 !important;
  }

  ${p =>
    !!p.value &&
    css`
      .ant-input-prefix i {
        color: ${p.disabled ? p.theme.colorTextDisabled : p.theme.colorPrimary};
      }
    `};

  ${p => !p.hideRequired && requiredFieldMarker()};

  ${p =>
    p.disabled &&
    css`
      &::after {
        color: ${p.theme.colorTextDisabled};
      }
    `}
  & .ant-input-prefix {
    margin-inline-end: 8px;
  }

  i {
    color: ${p => p.theme.colorBorder};
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  &.ant-input-affix-wrapper-focused {
    i {
      color: ${p => p.theme.colorPrimary};
    }
  }

  &.ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(
      .ant-input-affix-wrapper-borderless
    ).ant-input-affix-wrapper,
  &.ant-input-status-error:not(.ant-input-disabled) {
    background-color: ${p => p.theme.colorErrorText}0a;
    border-width: 1px;

    i {
      &:before {
        content: '${iconObject['error_filled']}';
      }

      color: ${p => p.theme.colorErrorText};
    }

    input {
      background: transparent;

      &,
      &::placeholder {
        color: ${p => p.theme.colorErrorText};
      }
    }
  }
`;

export default Input;
