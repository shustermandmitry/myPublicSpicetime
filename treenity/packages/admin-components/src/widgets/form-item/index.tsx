import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Form, FormItemProps } from 'antd';
import React, { FC } from 'react';

interface FormItemPropsStyledProps extends FormItemProps {
  size?: 'default' | 'small';
  hideRequired?: boolean;
}

const FormItem: FC<FormItemPropsStyledProps> = ({ children, ...restProps }) => {
  return <FormItemStyled {...restProps}>{children}</FormItemStyled>;
};

const FormItemStyled = styled(
  Form.Item,
  omitProps('size', 'hideRequired'),
)<FormItemPropsStyledProps>`
  .ant-form-item,
  .ant-form-item-required {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  & .ant-form-item-explain {
    z-index: 1;
  }

  .ant-form-item-explain-error {
    right: 0;
    bottom: -9px;
    padding: 4px 6px;
    width: fit-content;
    position: absolute;
    border-radius: 4px;
    height: 20px !important;
    background: ${p => p.theme.colorError};

    font-size: 12px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: -0.48px;
    color: ${p => p.theme.colorBgBase};
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

    ${p =>
      // @ts-ignore
      (p.children?.props?.size === 'small' ||
        // @ts-ignore
        p.children?.props?.size === 'x-small' ||
        p?.size === 'small') &&
      css`
        font-size: 10px;
        padding: 2px 3px;
        letter-spacing: -0.4px;
        height: 14px !important;
      `};
  }

  .ant-form-item-explain.ant-form-item-explain-connected {
    margin-top: 0 !important;
  }

  ${p =>
    p.hideRequired &&
    css`
      .ant-form-item-control-input-content > .ant-input-affix-wrapper::after,
      .ant-form-item-label > label.ant-form-item-required::before {
        content: none !important;
      }
    `};
`;

export default FormItem;
