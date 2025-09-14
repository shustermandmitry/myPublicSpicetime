import { IIcon } from '@/make-icon/types';
import { omitProps } from '@/utils/emotion-omit-props';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import './icomoon.css';

function IconUnstyled({ name, className, style }: IIcon<string[]>) {
  return <i className={`icon-${name} ${className}`} style={style} />;
}

const colorTable: Record<string, string> = {
  default: 'colorText',
  danger: 'colorError',
  primary: 'colorPrimary',
  gray: 'colorTextQuaternary',
};

const Icon = styled(IconUnstyled, omitProps('spin', 'color', 'rotate'))<
  Pick<IIcon<any>, 'rotate' | 'spin' | 'color'>
>`
  transition: transform 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  ${p => (p.rotate || p.rotate === 0) && `transform: rotate(${p.rotate}deg)`};

  ${({ spin }) =>
    spin &&
    css`
      transform-origin: 52%;
      animation: icon-rotation ${typeof spin === 'boolean' ? 1 : spin}s linear infinite;
      display: block;
    `};

  ${p =>
    p.color &&
    css`
      color: ${(p.theme as any)?.[colorTable[p.color] || p.color] || p.color};
    `};
`;

export default Icon;
