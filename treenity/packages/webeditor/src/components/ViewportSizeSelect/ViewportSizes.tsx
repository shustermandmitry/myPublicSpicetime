/*
 * Copyright (c) 2024. Treenity Inc.
 */

import type { IconTypes } from '@/components/Icon';
import Icon from '@/components/Icon';
import type { ScreenSize } from '@/constants';

import { Button } from 'antd';
import type { FC } from 'react';

interface ISizesPanelProps {
  value: ScreenSize;
  sizes?: Record<string, ScreenSize>;
  onChangeSize(size: ScreenSize): void;
}

export const defaultSizes: Partial<Record<IconTypes, ScreenSize>> = {
  mobile: 'sm',
  'mobile-vertical': 'md',
  tablet: 'lg',
  'tablet-vertical': 'xl',
  monitor: 'xxl',
};

const ViewportSizes: FC<ISizesPanelProps> = ({ sizes = defaultSizes, value, onChangeSize }) => {
  return (
    <>
      {Object.entries(sizes).map(([icon, size], index) => {
        const isCurrent = size === value;
        return (
          <Button
            key={index}
            onClick={e => {
              e.stopPropagation();
              return !isCurrent && onChangeSize(size);
            }}
            type={(isCurrent && 'primary') || 'text'}
            icon={<Icon type={icon as IconTypes} width={20} height={20} />}
          ></Button>
        );
      })}
    </>
  );
};

export default ViewportSizes;
