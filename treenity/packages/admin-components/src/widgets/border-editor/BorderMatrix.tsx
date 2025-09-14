/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Button from '@/components/button';
import Icon from '@/components/icon';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, useCallback } from 'react';

export type BorderMatrixItems = 'top' | 'right' | 'bottom' | 'left' | 'all';

interface BorderMatrixProps {
  value: BorderMatrixItems;
  onChange(value: BorderMatrixItems): void;
}

const BorderMatrix: FC<BorderMatrixProps> = ({ value = 'all', onChange }) => {
  const isSelected = useCallback(
    (name: BorderMatrixItems) => {
      if (value === name) {
        return 'primary';
      }

      return 'secondary-outlined';
    },
    [value],
  );

  return (
    <Root>
      <div>
        <ButtonStyled
          onClick={() => onChange('top')}
          type={isSelected('top')}
          size="x-small"
          icon={<Icon name="border-top_outlined" />}
        />
      </div>
      <div>
        <ButtonStyled
          onClick={() => onChange('left')}
          type={isSelected('left')}
          size="x-small"
          icon={<Icon name="border-left_outlined" />}
        />
        <ButtonStyled
          onClick={() => onChange('all')}
          type={isSelected('all')}
          size="x-small"
          icon={<Icon name="border-all_outlined" />}
        />
        <ButtonStyled
          onClick={() => onChange('right')}
          type={isSelected('right')}
          size="x-small"
          icon={<Icon name="border-right_outlined" />}
        />
      </div>
      <div>
        <ButtonStyled
          onClick={() => onChange('bottom')}
          type={isSelected('bottom')}
          size="x-small"
          icon={<Icon name="border-bottom_outlined" />}
        />
      </div>
    </Root>
  );
};

const ButtonStyled = styled(Button)`
  ${p =>
    p.type === 'secondary-outlined' &&
    css`
      i {
        color: ${p.theme.colorText};
      }
    `}
`;

const Root = styled.div`
  flex-direction: column;
  width: 64px;

  &,
  & > div {
    display: flex;
    gap: 2px;
    justify-content: center;
  }
`;

export default BorderMatrix;
