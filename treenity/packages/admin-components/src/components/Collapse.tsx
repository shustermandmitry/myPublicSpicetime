/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Collapse as AntdCollapse, CollapseProps } from 'antd';
import { FC, useMemo } from 'react';

export type CollapsedVariant = 'section' | 'container';

interface CollapseStyledProps extends Omit<CollapseProps, 'ref'> {
  isOpen?: boolean;
  variant?: CollapsedVariant;
}

interface CollapseButtonProps {
  collapsed: boolean;
  variant?: CollapsedVariant;
}

export const CollapseButton: FC<CollapseButtonProps> = ({ collapsed, variant }) => {
  return (
    <ButtonContainer variant={variant}>
      <Icon name={`${collapsed ? 'arrow-bottom_outlined' : 'arrow-top_outlined'}`} />
    </ButtonContainer>
  );
};

const Collapse: FC<CollapseStyledProps> = ({ isOpen = false, variant, items, ...restProps }) => {
  const activeKeys = useMemo(
    () => (isOpen && items?.length ? items.map((_, index) => `${index}`) : []),
    [items],
  );

  return (
    <CollapseStyled
      {...restProps}
      items={items}
      variant={variant}
      defaultActiveKey={activeKeys}
      ghost
      expandIcon={panelProps => (
        <CollapseButton collapsed={!(panelProps.isActive ?? true)} variant={variant} />
      )}
      expandIconPosition="end"
    />
  );
};

const CollapseStyled = styled(AntdCollapse, omitProps('variant'))<CollapseStyledProps>`
  ${p => p.variant === 'container' && css``};

  &&& {
    .ant-collapse-header {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      padding-inline: 10px;
      transition: background 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .ant-menu-title-content {
      transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86) !important;
    }

    .ant-collapse-content-box {
      padding: 0 10px 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
`;

const ButtonContainer = styled('div', omitProps('variant'))<{ variant?: CollapsedVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colorBorder};
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: none;

  ${p =>
    p.variant === 'container' &&
    css`
      border: 0;
      background-color: transparent;
    `}
`;

export default Collapse;
