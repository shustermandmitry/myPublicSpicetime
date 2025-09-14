import Button from '@/components/button';
import Icon from '@/components/icon';
import Input from '@/components/input';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useToggle } from '@treenity/ui-kit/hooks';
import { omitProps } from '@treenity/ui-kit/utils';
import React, { ChangeEvent, FC, useRef } from 'react';

interface IAngleSelector {
  onChange(value: number): void;
  value: number;
}

const DISTRICT_DEGREES = 360;

const AngleSelector: FC<IAngleSelector> = ({ onChange, value }) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useToggle();

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const rotateIncrease = () => {
    onChange((value + 1) % DISTRICT_DEGREES);
  };

  const rotateDecrease = () => {
    onChange((value - 1 + DISTRICT_DEGREES) % DISTRICT_DEGREES);
  };

  const getAngleFromMousePosition = (event: MouseEvent) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const rad = Math.atan2(deltaY, deltaX);
    const deg = rad * (180 / Math.PI);
    return Math.floor((deg + 90 + DISTRICT_DEGREES) % DISTRICT_DEGREES);
  };

  const onMouseDown = (event: React.MouseEvent) => {
    setToggle(true);
    onChange(getAngleFromMousePosition(event.nativeEvent));
  };

  const onMouseMove = (event: MouseEvent) => {
    if (toggle) {
      onChange(getAngleFromMousePosition(event));
    }
  };

  const onMouseUp = () => {
    setToggle(false);
  };

  return (
    <Root>
      <OuterCircle
        data-testid="asdqwe"
        angle={value}
        ref={dialRef}
        onMouseDown={onMouseDown}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => onMouseMove(e.nativeEvent)}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
      >
        <InnerCircle>
          <Arrow>
            <Icon name="preview_filled" color="primary" />
            <Icon name="color-picker_filled" color="primary" />
            <Circle />
          </Arrow>
        </InnerCircle>
      </OuterCircle>
      <Input
        type="number"
        size="x-small"
        placeholder="0"
        min={0}
        max={DISTRICT_DEGREES}
        value={value}
        onChange={onInputChange}
      />
      <Buttons>
        <Button
          type="secondary-outlined"
          size="x-small"
          icon={<Icon name="arrow-rotate-left_outlined" />}
          onClick={rotateDecrease}
        />
        <Button
          type="secondary-outlined"
          size="x-small"
          icon={<Icon name="arrow-rotate-right_outlined" />}
          onClick={rotateIncrease}
        />
      </Buttons>
    </Root>
  );
};

const Circle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: ${p => p.theme.colorPrimary};
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 64px;
`;

const InnerCircle = styled.div`
  position: relative;
  width: 46px;
  height: 46px;
  border: 1px solid ${p => p.theme.gray400};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterCircle = styled('div', omitProps('angle'))<{ angle: number }>`
  position: relative;
  width: 64px;
  height: 64px;
  border: 1px solid ${p => p.theme.gray400};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${p => p.theme.colorBgBase};

  ${p => css`
    transform: rotate(${p.angle - 90}deg);
  `}
`;

const Arrow = styled.div`
  width: 46px;
  height: 1px;
  background-color: ${p => p.theme.colorPrimary};
  position: absolute;

  span {
    position: absolute;
    top: 50%;

    &:nth-of-type(1) {
      transform: translate(90%, -50%);
      right: 1px;
    }

    &:nth-of-type(2) {
      left: 0;
      transform: translate(-39%, -47%) rotate(45deg);
    }

    i {
      font-size: 6px !important;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;

  && > button {
    width: 100% !important;

    i {
      color: ${p => p.theme.colorText};
    }
  }
`;

export default AngleSelector;
