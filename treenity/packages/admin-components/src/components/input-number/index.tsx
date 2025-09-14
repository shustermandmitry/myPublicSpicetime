import requiredFieldMarker from '@/components/RequiredFieldMarker';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize } from '@treenity/ui-kit/utils';
import { InputNumber as InputNumberStyled, InputNumberProps } from 'antd';
import { forwardRef } from 'react';

export type InputStyledSize = InputNumberProps['size'] | 'x-small' | 'x-large';

export interface InputNumberStyledProps extends Omit<InputNumberProps, 'size'> {
  size?: InputStyledSize;
}

const OmitInputNumber = forwardRef<HTMLInputElement, InputNumberStyledProps>(
  ({ prefix, size = 'middle', ...restProps }, ref) => {
    return (
      <InputNumberStyled
        ref={ref}
        size={normalizeComponentSize(size)}
        controls={false}
        suffix={prefix}
        {...restProps}
      />
    );
  },
);

const InputNumber = styled(OmitInputNumber)<{ size?: InputStyledSize }>`
  &&& input {
    border-radius: 0 !important;
    padding-left: 0;
  }

  &.ant-input-number-outlined:focus,
  &.ant-input-number-outlined:focus-within {
    box-shadow: none;
  }

  &&& .ant-input-number,
  &&& .ant-input-number-input-wrap {
    line-height: 1;
  }

  .ant-input-number {
    background: transparent;

    .ant-input-number-input {
      font-weight: 500;
    }
  }

  .ant-input-number-affix-wrapper {
    border-width: 1px;
  }

  width: 100%;
  align-items: center;

  ${p =>
    Number.isInteger(p.value) &&
    css`
      .ant-input-number-suffix > span > i {
        color: ${p.theme.colorPrimary};
      }
    `};

  ${requiredFieldMarker()};

  ${p =>
    p.disabled &&
    css`
      &::after {
        color: ${p.theme.colorTextDisabled};
      }
    `}
  &.ant-input-number-affix-wrapper input.ant-input-number-input {
    padding: 0;
  }

  i {
    color: ${p => p.theme.colorBorder};
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  &.ant-input-number-group-wrapper .ant-input-number-affix-wrapper {
    display: flex;
    align-items: center;
  }

  .ant-input-number-suffix {
    order: -1;
    margin-left: 0;
    position: relative;

    ${p =>
      p.disabled &&
      css`
        i {
          color: ${p.theme.colorGrayText};
        }
      `}
  }

  .ant-input-number-focused + span > i {
    color: ${p => p.theme.colorPrimary};
  }

  &.ant-input-number-status-error:not(.ant-input-number-affix-wrapper-disabled):not(
      .ant-input-number-affix-wrapper-borderless
    ).ant-input-number-affix-wrapper {
    background-color: ${p => p.theme.colorErrorText}0a;
    border-width: 1px;

    &.ant-input-number-affix-wrapper-lg {
      border-width: 1px;
    }

    i {
      &:before {
        content: '\\e932';
      }

      color: ${p => p.theme.colorErrorText};
    }

    .ant-input-number {
      background: transparent;
    }

    input {
      &,
      &::placeholder {
        color: ${p => p.theme.colorErrorText};
      }
    }
  }

  .ant-input-number-group-addon {
    background: ${p => p.theme.colorBgBase};
  }

  &.ant-input-number-disabled .ant-input-number-input {
    color: ${p => p.theme.colorGrayText};
  }

  ${p =>
    p.disabled &&
    css`
      i {
        color: ${p.theme.colorErrorText};
      }
    `}

  ${p =>
    p.size === 'x-large' &&
    css`
      height: 48px;
      border-radius: 12px;
      padding-inline-start: 12px;

      &&& input {
        font-size: 16px;
        height: 46px;
      }

      i {
        font-size: 20px;
      }
    `};

  ${p =>
    p.size === 'large' &&
    css`
      height: 40px;
      border-radius: 8px;
      padding-inline-start: 12px;

      &&& input {
        font-size: 16px;
        height: 38px;
      }

      i {
        font-size: 20px;
      }
    `};

  ${p =>
    p.size === 'middle' ||
    (!p.size &&
      css`
        height: 32px;
        border-radius: 6px;
        padding-inline-start: 10px;

        &&& input {
          font-size: 14px;
          height: 30px;
        }

        i {
          font-size: 16px;
        }
      `)};

  ${p =>
    p.size === 'small' &&
    css`
      height: 24px;
      border-radius: 4px;
      padding-inline-start: 8px;

      &&& input {
        font-size: 12px;
        height: 22px;
      }

      i {
        font-size: 14px;
      }
    `};

  ${p =>
    p.size === 'x-small' &&
    css`
      height: 20px;
      border-radius: 4px;
      padding-inline-start: 6px;

      &&& input {
        font-size: 10px;
        height: 18px;
      }

      i {
        font-size: 12px;
      }
    `};
`;

export default InputNumber;
