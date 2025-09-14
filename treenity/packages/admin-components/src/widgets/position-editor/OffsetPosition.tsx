/*
 * Copyright (c) 2024. Treenity Inc.
 */

import ButtonWithIcon from '@/components/ButtonWithIcon';
import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { omitProps } from '@treenity/ui-kit/utils';
import React, { FC, ReactNode, useEffect } from 'react';
import InputWithUnits from '../input-with-units';
import { PositionThemedOffsetValue } from './index';

interface HideTiesProps {
  vertical?: boolean;
  horizontal?: boolean;
}

interface OffsetPositionProps {
  label?: string;
  value: PositionThemedOffsetValue;
  centerContent?: ReactNode;
  hideTies?: HideTiesProps;
  isHideAuto?: boolean;
  onChange(value: PositionThemedOffsetValue): void;
}

const OffsetPosition: FC<OffsetPositionProps> = ({
  value,
  onChange,
  label,
  centerContent,
  hideTies,
  isHideAuto,
}) => {
  const [tieVertical, toggleTieVertical] = useToggle();
  const [tieHorizontal, toggleTieHorizontal] = useToggle();

  const onClickVertical = () => {
    toggleTieVertical();
    syncVerticalValues();
  };

  const onClickHorizontal = () => {
    toggleTieHorizontal();
    syncHorizontalValues();
  };

  const syncVerticalValues = () => {
    const newValue = { ...value };
    if (newValue.top) {
      newValue.bottom = newValue.top;
    } else if (newValue.bottom) {
      newValue.top = newValue.bottom;
    }
    onChange(newValue);
  };

  const syncHorizontalValues = () => {
    const newValue = { ...value };
    if (newValue.left) {
      newValue.right = newValue.left;
    } else if (newValue.right) {
      newValue.left = newValue.right;
    }
    onChange(newValue);
  };

  const handleChange = (name: keyof PositionThemedOffsetValue) => (newValue?: string) => {
    const updatedValue = { ...value, [name]: newValue };

    if (tieHorizontal && (name === 'left' || name === 'right')) {
      updatedValue.left = updatedValue.right = newValue;
    }

    if (tieVertical && (name === 'top' || name === 'bottom')) {
      updatedValue.top = updatedValue.bottom = newValue;
    }

    onChange(updatedValue);
  };

  useEffect(() => {
    if (tieHorizontal) {
      syncHorizontalValues();
    }
  }, [tieHorizontal, value.left, value.right]);

  useEffect(() => {
    if (tieVertical) {
      syncVerticalValues();
    }
  }, [tieVertical, value.top, value.bottom]);

  return (
    <Root>
      <Label>{label}</Label>
      <Vertical>
        <InputWithUnitsStyled
          isHideAuto={isHideAuto}
          size="x-small"
          value={value?.top}
          onChange={handleChange('top')}
        />
        {!hideTies?.vertical && (
          <ButtonWithIconStyled
            primaryIcon={tieVertical}
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="border-solid_outlined" />}
            onClick={onClickVertical}
          />
        )}
      </Vertical>
      <Center>
        <InputWithUnitsStyled
          isHideAuto={isHideAuto}
          size="x-small"
          value={value?.left}
          onChange={handleChange('left')}
        />
        {!hideTies?.horizontal && (
          <ButtonWithIconStyled
            primaryIcon={tieHorizontal}
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="border-dash_outlined" />}
            onClick={onClickHorizontal}
          />
        )}
        {centerContent || <CenterEmptyBlock />}
        {!hideTies?.horizontal && (
          <ButtonWithIconStyled
            primaryIcon={tieHorizontal}
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="border-dash_outlined" />}
            onClick={onClickHorizontal}
          />
        )}
        <InputWithUnitsStyled
          isHideAuto={isHideAuto}
          size="x-small"
          value={value?.right}
          onChange={handleChange('right')}
        />
      </Center>
      <Vertical>
        {!hideTies?.vertical && (
          <ButtonWithIconStyled
            primaryIcon={tieVertical}
            size="x-small"
            type="secondary-filled"
            icon={<Icon name="border-solid_outlined" />}
            onClick={onClickVertical}
          />
        )}
        <InputWithUnitsStyled
          isHideAuto={isHideAuto}
          size="x-small"
          value={value?.bottom}
          onChange={handleChange('bottom')}
        />
      </Vertical>
    </Root>
  );
};

const Label = styled.span`
  position: absolute;
  z-index: 2;
  font-size: 8px;
  font-weight: 800;
  line-height: 140%;
  letter-spacing: -0.16px;
  top: 6px;
  left: 6px;
  text-transform: uppercase;
`;

const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  i {
    transform: rotate(90deg);
  }
`;

const CenterEmptyBlock = styled.div`
  width: 20px;
  height: 20px;
`;

const Center = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonWithIconStyled = styled(ButtonWithIcon, omitProps('primaryIcon'))<{
  primaryIcon?: boolean;
}>`
  z-index: 1;
  background: transparent !important;

  i {
    transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }

  &:not(:hover) {
    i {
      color: ${p => p.theme.gray700};
    }
  }

  &:hover {
    i {
      color: ${p => p.theme.colorPrimary};
    }
  }

  ${p =>
    p.primaryIcon &&
    css`
      i {
        color: ${p.theme.colorPrimary} !important;
      }
    `}
`;

const InputWithUnitsStyled = styled(InputWithUnits)`
  width: 53px;
  min-width: 53px;

  input {
    border: none;
  }
`;

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${p => p.theme.gray400};
  background: ${p => p.theme.colorBgContainer};
  border-radius: 8px;
`;

export default OffsetPosition;
