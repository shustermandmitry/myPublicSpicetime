/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { WithEditorProps } from '@/types';

import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import type { FC } from 'react';
import dropZoneFixStyles from '../shared/dropZoneFix.styles';
import { Element } from '@craftjs/core';

import type { FlexProps } from './types';
import { FlexEntity } from './flex.entity';

export const Flex: FC<WithEditorProps<FlexProps, FlexEntity>> = ({
  mergedMeta: { items, ...meta },
  value,
  style,
  id,
  className,
}) => {
  return (
    <FlexContainer style={style} {...meta}>
      <div>flex</div>
    </FlexContainer>
  );
};

const FlexContainer = styled(
  'div',
  omitProps(
    'height',
    'width',
    'overflow',
    'gap',
    'justifyContent',
    'backgroundColor',
    'borderRadius',
    'flexDirection',
    'alignItems',
    'image',
    'customStyles',
    'spacing',
    'url',
  ),
)<
  {
    gap: string;
    justifyContent: string;
    alignItems: string;
    width: string;
    height: string;
    backgroundColor: string;
    borderRadius: string;
  } & Pick<FlexProps, 'image' | 'flexDirection' | 'overflow'>
>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  flex-direction: ${({ flexDirection }) => flexDirection};
  display: flex;
  gap: ${({ gap }) => gap};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  object-fit: cover;
  border-radius: ${({ borderRadius }) => borderRadius};
  position: relative;
  overflow: ${({ overflow }) => overflow};

  ${({ image }) => {
    return (
      image &&
      `
  &:before {
    content: '';
    background-image: url(${image?.src});
    background-repeat: no-repeat;
    ${image.backgroundPosition && `background-position: ${image.backgroundPosition};`}
    ${image.backgroundSize && `background-size: ${image.backgroundSize};`}
    border-radius: inherit;
    width: 100%;
    height: 100%;
    inset: 0;
    position: absolute;
    pointer-events: none;
    user-select: none;
    z-index: -1;
  }
  `
    );
  }}
`;

Flex.displayName = 'UI.Flex';
