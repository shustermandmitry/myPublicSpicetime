import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Switch as SwitchAntd, SwitchProps } from 'antd';
import React, { forwardRef } from 'react';

export interface SwitchStyledProps extends Omit<SwitchProps, 'size'> {
  size?: 'small' | 'default' | 'large';
}

const OmitSwitch = forwardRef<HTMLButtonElement, SwitchStyledProps>(
  ({ size, ...restProps }, ref) => {
    const _size = size === 'large' ? 'default' : size;

    return <SwitchAntd ref={ref} size={_size} {...restProps} />;
  },
);

const Switch = styled(OmitSwitch)<SwitchStyledProps>`
  background: ${p => p.theme.gray400};

  &:hover:not(.ant-switch-disabled) {
    background: ${p => p.theme.gray400};
  }

  & > div[style^='position: absolute'] {
    display: none;
  }

  .ant-switch-handle {
    inset-inline-start: 2px;
  }

  &.ant-switch-checked {
    .ant-switch-handle {
      &:before {
        background-color: ${p => p.theme.colorBgContainer};
      }
    }
  }

  &:not(.ant-switch-checked) {
    .ant-switch-handle {
      &:before {
        background-color: ${p => p.theme.colorPrimary};
      }
    }
  }

  &.ant-switch-small {
    min-width: 18px;
    width: 18px;
    height: 12px;
    line-height: 12px;

    .ant-switch-handle {
      top: 2px;
      width: 8px;
      height: 8px;
    }

    .ant-switch-inner {
      padding-inline-start: 10px;
      padding-inline-end: 2px;
    }

    &.ant-switch-checked {
      .ant-switch-inner {
        padding-inline-start: 2px;
        padding-inline-end: 10px;
      }

      .ant-switch-handle {
        inset-inline-start: calc(100% - 10px);
      }
    }
  }

  ${p =>
    (p.size === 'default' || !p.size) &&
    css`
      min-width: 24px;
      width: 24px;
      height: 16px;
      line-height: 16px;

      .ant-switch-handle {
        top: 2px;
        width: 12px;
        height: 12px;
      }

      .ant-switch-inner {
        padding-inline-start: 14px;
        padding-inline-end: 2px;
      }

      &.ant-switch-checked {
        .ant-switch-inner {
          padding-inline-start: 2px;
          padding-inline-end: 14px;
        }

        .ant-switch-handle {
          inset-inline-start: calc(100% - 14px);
        }
      }
    `}

  ${p =>
    p.size === 'large' &&
    css`
      min-width: 32px;
      width: 32px;
      height: 20px;
      line-height: 20px;

      .ant-switch-handle {
        top: 2px;
        width: 16px;
        height: 16px;
      }

      .ant-switch-inner {
        padding-inline-start: 18px;
        padding-inline-end: 2px;
      }

      &.ant-switch-checked {
        .ant-switch-inner {
          padding-inline-start: 2px;
          padding-inline-end: 18px;
        }

        .ant-switch-handle {
          inset-inline-start: calc(100% - 18px);
        }
      }
    `}
`;

export default Switch;
