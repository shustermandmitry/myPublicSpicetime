/*
 * Copyright (c) 2024. Treenity Inc.
 */
import { TextContent } from '@/components/typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { FC, PropsWithChildren } from 'react';

const DEFAULT_LABEL_WIDTH = 72; //px

type AlignPanelItemType = 'center' | 'start';

export interface PanelItemProps {
  label?: string;
  align?: AlignPanelItemType;
  width?: number;
  labelWidth?: number;
  fullWithLabel?: boolean;
}

const PanelItem: FC<PropsWithChildren<PanelItemProps>> = ({
  label,
  align,
  width,
  labelWidth,
  children,
  fullWithLabel,
  ...restProps
}) => {
  return (
    <Root align={align} {...restProps}>
      {label && (
        <Label fontWeight={700} size={10} as="p" width={labelWidth} fullWithLabel={fullWithLabel}>
          {label}
        </Label>
      )}
      <Content width={width} fullWithLabel={fullWithLabel}>
        {children}
      </Content>
    </Root>
  );
};

const Root = styled('div', omitProps('align'))<{ align?: AlignPanelItemType }>`
  display: flex;
  flex-direction: row;
  gap: 4px;
  line-height: 1;
  justify-content: center;

  align-items: ${p => (p.align === 'center' ? 'center' : p.align === 'start' ? 'start' : 'start')};
`;

const Content = styled('div', omitProps('width', 'fullWithLabel'))<{
  width?: number;
  fullWithLabel?: boolean;
}>`
  flex: ${p => (p.fullWithLabel ? 'none' : 1)};
  width: ${p => p.width && `${p.width}px`};
`;

const Label = styled(TextContent, omitProps('width', 'fullWithLabel'))<{
  width?: number;
  fullWithLabel?: boolean;
}>`
  ${p =>
    p.fullWithLabel
      ? css`
          flex: 1;
        `
      : css`
          width: ${p.width || DEFAULT_LABEL_WIDTH}px;
        `};

  line-height: 20px;
  align-self: baseline;
`;

export default PanelItem;
