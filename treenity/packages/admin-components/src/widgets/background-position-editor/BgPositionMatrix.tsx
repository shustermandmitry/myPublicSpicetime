/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import React, { FC } from 'react';
import type { BgPositionThemedPositionValue } from './types';

interface BgPositionMatrixProps {
  value?: BgPositionThemedPositionValue;
  onChange(value: BgPositionThemedPositionValue): void;
}

const BgPositionMatrix: FC<BgPositionMatrixProps> = ({ value, onChange }) => {
  return (
    <Root id="bg-position">
      <Top>
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'top', x: 'left' })}
          icon={
            <IconStyled
              name="corner_filled"
              color={value?.y === 'top' && value?.x === 'left' ? 'primary' : 'gray700'}
            />
          }
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'top', x: 'center' })}
          icon={
            <IconStyled
              name="side-v_filled"
              color={value?.y === 'top' && value?.x === 'center' ? 'primary' : 'gray700'}
            />
          }
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'top', x: 'right' })}
          icon={
            <IconStyled
              name="corner_filled"
              color={value?.y === 'top' && value?.x === 'right' ? 'primary' : 'gray700'}
            />
          }
        />
      </Top>
      <Center>
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'center', x: 'left' })}
          icon={
            <IconStyled
              name="side-h_filled"
              color={value?.y === 'center' && value?.x === 'left' ? 'primary' : 'gray700'}
            />
          }
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'center', x: 'center' })}
          icon={
            <IconStyled
              name="center_filled"
              color={value?.y === 'center' && value?.x === 'center' ? 'primary' : 'gray700'}
            />
          }
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'center', x: 'right' })}
          icon={
            <IconStyled
              name="side-h_filled"
              color={value?.y === 'center' && value?.x === 'right' ? 'primary' : 'gray700'}
            />
          }
        />
      </Center>
      <Bottom>
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'bottom', x: 'left' })}
          icon={
            <IconStyled
              name="corner_filled"
              color={value?.y === 'bottom' && value?.x === 'left' ? 'primary' : 'gray700'}
            />
          }
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'bottom', x: 'center' })}
          icon={
            <IconStyled
              name="side-v_filled"
              color={value?.y === 'bottom' && value?.x === 'center' ? 'primary' : 'gray700'}
            />
          }
        />

        <Button
          type="secondary-outlined"
          size="x-small"
          onClick={() => onChange({ y: 'bottom', x: 'right' })}
          icon={
            <IconStyled
              name="corner_filled"
              color={value?.y === 'bottom' && value?.x === 'right' ? 'primary' : 'gray700'}
            />
          }
        />
      </Bottom>
    </Root>
  );
};

const IconStyled = styled(Icon, omitProps('color'))`
  &&&& > i {
    ${p =>
      p.color &&
      css`
        color: ${// @ts-ignore
        p.theme?.[p.color]};
      `};
  }
`;

const IconPositionIcon = css`
  &:first-of-type {
    & > span {
      justify-content: start;
    }
  }

  &:last-of-type {
    & > span {
      justify-content: end;
    }
  }
`;

const Top = styled.div`
  button {
    align-items: start;

    ${IconPositionIcon}
  }
`;

const Center = styled.div`
  align-items: center;

  button {
    &:nth-of-type(2) {
      i {
        font-size: 14px;
      }
    }

    ${IconPositionIcon}
  }
`;

const Bottom = styled.div`
  align-items: end;

  button {
    align-items: end;
    ${IconPositionIcon}
  }
`;

const Root = styled.div`
  padding: 2px;
  border-radius: 6px;
  border: 1px solid ${p => p.theme.gray400};
  background: ${p => p.theme.colorBgContainer};
  width: 64px;
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  button {
    border: none;
    padding: 0;
    width: 19px;
    height: 19px;

    & > div {
      display: none;
    }

    &:hover {
      i {
        color: ${p => p.theme.colorPrimary};
      }
    }
  }

  & > div {
    display: flex;
    justify-content: space-between;
  }

  button {
    i {
      transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      font-size: 10px;
    }
  }
`;

export default BgPositionMatrix;
