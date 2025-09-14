/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import Button, { ButtonStyledType } from './button';

export type JustifyButtonType =
  | 'center'
  | 'start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'left'
  | 'right'
  | 'normal'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'initial'
  | 'stretch';

const ButtonWithIcon = styled(Button, omitProps('justify'))<{
  type?: ButtonStyledType;
  justify?: JustifyButtonType;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${p => css`
    justify-content: ${p.justify || 'none'};

    ${p.type === 'text' &&
    css`
      color: ${p.theme.colorPrimary};
      background: transparent !important;

      &:hover {
        color: ${p.theme.colorBtnBgHover} !important;
      }

      &:active {
        color: ${p.theme.colorBtnBgActive} !important;
      }
    `}
  `}
`;

export default ButtonWithIcon;
