/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Segmented from '@/components/Segmented';
import Select from '@/components/select';
import { BackgroundThemedValue } from '@/widgets/background-editor/types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { getImageUrl, omitProps } from '@treenity/ui-kit/utils';
import { FC } from 'react';
import BgPositionMatrix from './BgPositionMatrix';
import { BACKGROUND_POSITION_X, BACKGROUND_POSITION_Y, optionsBorderRadius } from './lists';
import { BgPositionThemedPositionValue, BgPositionThemedProps, BgPositionThemedValue } from './types';

export const defaultBgPositionValues: BgPositionThemedValue = {
  positions: {
    x: 'left',
    y: 'top',
  },
  repeat: 'no-repeat',
};

const BgPositionThemed: FC<BgPositionThemedProps> = ({
  onChange,
  value = defaultBgPositionValues,
  imageStyle,
}) => {
  const handleChange = (name: string) => (newValue?: string | BgPositionThemedPositionValue) => {
    let updatedValue: BgPositionThemedValue;

    if (name === 'positions.x' || name === 'positions.y') {
      const [parent, child] = name.split('.');
      updatedValue = {
        ...value,
        [parent]: {
          ...value[parent as 'positions'],
          [child]: newValue,
        },
      };
    } else {
      updatedValue = { ...value, [name]: newValue };
    }

    onChange?.(updatedValue);
  };

  return (
    <Root>
      <BgPositionMatrix value={value.positions} onChange={handleChange('positions')} />
      <LeftContainer>
        <HorizontalContainer>
          <Select
            id="rasqwe"
            size="x-small"
            options={BACKGROUND_POSITION_X}
            value={value.positions.x}
            onChange={handleChange('positions.x')}
          />
          <Select
            size="x-small"
            options={BACKGROUND_POSITION_Y}
            value={value.positions.y}
            onChange={handleChange('positions.y')}
          />
        </HorizontalContainer>
        <SegmentedThemedStyled
          size="small"
          options={optionsBorderRadius}
          block
          value={value.repeat}
          onChange={handleChange('repeat')}
        />
        {imageStyle && <Preview {...imageStyle}></Preview>}
      </LeftContainer>
    </Root>
  );
};

const Preview = styled(
  'div',
  omitProps(
    'backgroundColor',
    'backgroundSize',
    'backgroundImage',
    'backgroundGradient',
    'backgroundPosition',
  ),
)<BackgroundThemedValue>`
  width: 100%;
  height: 110px;
  border: 1px solid ${p => p.theme.gray400};
  border-radius: 8px;

  ${p =>
    p.backgroundImage?.key &&
    css`
      background-image: url(${getImageUrl(220, 110, p.backgroundImage.key)});
    `};
  background-size: ${p => p.backgroundSize};
  background-repeat: ${p => p.backgroundPosition?.repeat};
  background-color: ${p => p.backgroundColor};
  background-position: ${p => p.backgroundPosition?.positions.x}
    ${p => p.backgroundPosition?.positions.y};
`;

const SegmentedThemedStyled = styled(Segmented)`
  .ant-segmented-item:first-of-type {
    width: 30px;
    max-width: 30px;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HorizontalContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
`;

export default BgPositionThemed;
export type { BgPositionThemedValue };
