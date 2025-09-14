import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { normalizeComponentSize, omitProps } from '@treenity/ui-kit/utils';
import { Select as SelectAntd, SelectProps } from 'antd';
//@ts-ignore
import type { BaseSelectRef } from 'rc-select';
import React, { forwardRef, ReactNode } from 'react';

export type SelectStyledSize = SelectProps['size'] | 'x-small' | 'x-large';

export interface SelectStyledProps extends Omit<SelectProps, 'size'> {
  size?: SelectStyledSize;
  prefix?: ReactNode;
}

const OmitSelect = forwardRef<BaseSelectRef, SelectStyledProps>(
  ({ size = 'middle', prefix, ...restProps }, ref) => {
    return (
      <Root size={size} value={restProps.value}>
        {prefix}
        <SelectAntd
          ref={ref}
          size={normalizeComponentSize(size)}
          suffixIcon={<Icon name="arrow-bottom_outlined" color="default" />}
          {...restProps}
        />
      </Root>
    );
  },
);

const Root = styled('div', omitProps('size', 'value'))<{ size?: SelectStyledSize; value: string }>`
  position: relative;
  width: 100%;

  & > span.anticon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    i {
      pointer-events: none;
    }

    ${p =>
      p.value &&
      css`
        color: ${p.theme.colorPrimary};
      `}

    ${p =>
      p.size === 'x-large' &&
      css`
        i {
          font-size: 20px;
        }

        left: 12px;
      `}
    ${p =>
      p.size === 'large' &&
      css`
        i {
          font-size: 20px;
        }

        left: 12px;
      `}
    ${p =>
      p.size === 'middle' &&
      css`
        i {
          font-size: 16px;
        }

        left: 10px;
      `}
    ${p =>
      p.size === 'small' &&
      css`
        i {
          font-size: 14px;
        }

        left: 8px;
      `}
    ${p =>
      p.size === 'x-small' &&
      css`
        i {
          font-size: 12px;
        }

        left: 6px;
      `}
  }
`;

const Select = styled(OmitSelect)<SelectStyledProps>`
  width: 100%;

  .ant-select-selector {
    box-shadow: none !important;
  }

  ${p => css`
    .ant-select-selection-item,
    .ant-select-item.ant-select-item-option:not(.ant-select-item-option-selected) {
      i {
        color: ${p.theme.colorPrimary};
      }
    }

    .ant-select-arrow > .anticon {
      pointer-events: none !important;
      color: green !important;
    }

    ${!!p.prefix &&
    css`
      &:not(.ant-select-customize-input) .ant-select-selector {
        ${p.size === 'x-large' &&
        css`
          padding-left: 40px !important;
        `}
        ${p.size === 'large' &&
        css`
          padding-left: 40px !important;
        `}
        ${p.size === 'middle' &&
        css`
          padding-left: 34px !important;
        `}
        ${p.size === 'small' &&
        css`
          padding-left: 28px !important;
        `}
        ${p.size === 'x-small' &&
        css`
          padding-left: 22px !important;
        `}
      }
    `}

    ${p.size === 'middle' &&
    css`
      .ant-select-selection-item {
        font-weight: 700;
        font-size: 12px;
        letter-spacing: -0.24px;
      }
    `};

    ${p.size === 'x-small' &&
    css`
      .ant-select-arrow {
        inset-inline-end: 4px;

        i {
          font-size: 12px;
        }
      }

      .ant-select-dropdown {
        border-radius: ${p.theme.Select.borderRadiusDropdownXS}px;

        .ant-select-item {
          border-radius: ${p.theme.Select.borderRadiusOptionXS}px;
        }
      }

      &.ant-select-single.ant-select-sm {
        height: ${p.theme.Select.optionHeightXS}px;
        font-size: ${p.theme.Select.fontSizeXS}px;

        & .ant-select-selector {
          font-size: ${p.theme.Select.fontSizeXS}px;
          border-radius: ${p.theme.Select.borderRadiusXS}px;
        }

        &:not(.ant-select-customize-input) .ant-select-selector {
          padding: 0 6px;

          .ant-select-selection-search-input {
            height: 18px;
          }
        }
      }
    `}
  `}
`;

export default Select;
