/*
 * Copyright (c) 2024. Treenity Inc.
 */

import CollapseThemed, { CollapsedVariant } from '@/components/Collapse';
import Icon from '@/components/icon';
import type { IconNamesMap } from '@/components/icon/icon-component/types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC, PropsWithChildren } from 'react';

interface CollapseContainerProps {
  title: string;
  isOpen?: boolean;
  variant?: CollapsedVariant;
  icon?: IconNamesMap;
  className?: string;
}

const CollapseContainer: FC<PropsWithChildren<CollapseContainerProps>> = ({
  title,
  isOpen,
  variant = 'section',
  icon,
  children,
  className,
}) => {
  return (
    <Root variant={variant} className={className}>
      <CollapseThemed
        isOpen={isOpen}
        variant={variant}
        items={[
          {
            label: (
              <Title variant={variant}>
                {icon && variant === 'container' && <Icon name={icon} />}
                {title}
              </Title>
            ),
            children: children,
          },
        ]}
      />
    </Root>
  );
};

const Root = styled('div', omitProps('variant'))<{ variant?: CollapsedVariant }>`
  ${p =>
    p.variant === 'section' &&
    css`
      border-bottom: 1px solid ${p.theme.colorBorder};
    `};

  ${p =>
    p.variant === 'container' &&
    css`
      border: 1px solid ${p.theme.gray400};
      border-radius: 8px;
      margin: 0 12px;
      background-color: ${p.theme.colorBgContainer};
    `}
`;

const Title = styled('div', omitProps('variant'))<{ variant?: CollapsedVariant }>`
  display: flex;
  gap: 6px;
  align-items: center;
  font-weight: 700;
  letter-spacing: -0.28px;

  i {
    font-size: 16px;
    color: ${p => p.theme.colorPrimary};
  }

  ${p =>
    p.variant === 'container' &&
    css`
      font-size: 12px;
    `}
`;

export default CollapseContainer;
