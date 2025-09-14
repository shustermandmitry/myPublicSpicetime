/*
 * Copyright (c) 2024. Treenity Inc.
 */

import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils'; // убедитесь, что эта функция правильно импортирована
import { Slider } from 'antd';
import { SliderRangeProps } from 'antd/es/slider';
import React, { FC, forwardRef } from 'react';

interface SliderRef {
  focus(): void;
  blur(): void;
}

export interface GradientSliderColors {
  color: string | null;
  position: number;
}

interface GradientSliderProps {
  colors: GradientSliderColors[];
}

type GradientSliderType = SliderRangeProps & React.RefAttributes<SliderRef> & GradientSliderProps;

const GradientSlider: FC<GradientSliderType> = forwardRef<SliderRef, GradientSliderType>(
  ({ ...restProps }, ref) => {
    return <SliderStyled ref={ref} {...restProps} />;
  },
);

const SliderStyled = styled(Slider, omitProps('colors'))<{
  colors: GradientSliderColors[];
}>`
  .ant-slider-rail {
    background: linear-gradient(
      ${p => `90deg, ${p.colors.map(({ color, position }, index) => `${color} ${position}%`)}`}
    );
  }

  .ant-slider-track {
    background-color: transparent !important;
  }
`;

export default GradientSlider;
