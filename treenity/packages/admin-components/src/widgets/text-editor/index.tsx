import Button from '@/components/button';
import ColorPicker from '@/components/color-picker';
import Icon from '@/components/icon';
import Input from '@/components/input';
import Segmented from '@/components/Segmented';
import Select from '@/components/select';
import PanelItem from '@/widgets/panel-item';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import { Dropdown } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import InputWithUnits from '../input-with-units';
import {
  ALIGN_OPTIONS,
  FONT_FAMILY_OPTIONS,
  FONT_LIST_ICONS,
  FONT_LIST_OPTIONS,
  FONT_STYLE_OPTIONS,
  FONT_TRANSFORM_OPTIONS,
  FONT_TYPE_ICONS,
  FONT_TYPE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  fontListItems,
  fontTypeItems,
  TEXT_DECORATION_OPTIONS,
} from './lists';

import {
  FONT_LIST_NAMES,
  FONT_TYPE_NAMES,
  TextPropsThemedProps,
  TextPropsThemedValue,
} from './types';

export const defaultValue: TextPropsThemedValue = {
  align: 'start',
  text: '',
  color: '#000000',
  fontFamily: 'roboto',
  fontWeight: '400',
  size: '16px',
  opacity: '100%',
  lineHeight: '150%',
  letterSpacing: '0px',
  textTransform: 'none',
  textStyle: 'normal',
  textDecoration: 'none',
  textType: 'text',
  textList: 'none',
};

const TextPropsThemed: FC<TextPropsThemedProps> = ({ onChange, value = {} }) => {
  useEffect(() => {
    onChange?.({ ...defaultValue, ...value });
  }, []);

  const handleChange = useCallback(
    (name: keyof TextPropsThemedValue) => (newValue?: string | boolean | number) => {
      const _value: TextPropsThemedValue = { ...defaultValue, ...value };

      //@ts-ignore
      _value[name] = newValue;

      onChange?.({ ...defaultValue, ..._value });
    },
    [onChange, value],
  );

  const onChangeType = useCallback((key: string) => handleChange('textType')(key), [handleChange]);
  const onChangeList = useCallback((key: string) => handleChange('textList')(key), [handleChange]);

  return (
    <Root>
      <PanelItem label="Text align">
        <Segmented
          size="small"
          options={ALIGN_OPTIONS}
          block
          onChange={handleChange('align')}
          value={value.align}
        />
      </PanelItem>
      <PanelItem label="Text">
        <Input
          placeholder="Text"
          onChange={e => handleChange('text')(e.target.value)}
          value={value.text}
        />
      </PanelItem>
      <PanelItem label="Color">
        <ColorPicker
          size="small"
          onChange={colorValue =>
            handleChange('color')(colorValue === null ? 'transparent' : colorValue?.toHexString())
          }
          value={value?.color || '#000000'}
        />
      </PanelItem>
      <PanelItem label="Font">
        <HorizontalContainer>
          <Select
            size="x-small"
            options={FONT_FAMILY_OPTIONS}
            prefix={<Icon name="font-type_outlined" />}
            onChange={handleChange('fontFamily')}
            value={value.fontFamily}
          />
          <Select
            size="x-small"
            defaultValue={value.fontWeight}
            options={FONT_WEIGHT_OPTIONS}
            onChange={handleChange('fontWeight')}
            value={value.fontWeight}
          />
        </HorizontalContainer>
      </PanelItem>
      <PanelItem label="Size">
        <InputWithUnits
          isHideAuto
          value={value.size}
          withRange={[0, 100]}
          step={1}
          onChange={handleChange('size')}
        />
      </PanelItem>
      <PanelItem label="Opacity" data-testid="input-opacity">
        <InputWithUnits
          isHideAuto
          value={value.opacity}
          withRange={[0, 100]}
          step={1}
          onChange={handleChange('opacity')}
        />
      </PanelItem>
      <HorizontalContainer>
        <PanelItem label="Line height" data-testid="input-line-height">
          <InputWithUnits
            isHideAuto
            value={value.lineHeight}
            icon={<Icon name="line-height_outlined" />}
            onChange={handleChange('lineHeight')}
          />
        </PanelItem>
        <PanelItem label="Letter spacing" data-testid="input-letter-spacing">
          <InputWithUnits
            isHideAuto
            value={value.letterSpacing}
            icon={<Icon name="letter-spacing-1_outlined" />}
            onChange={handleChange('letterSpacing')}
          />
        </PanelItem>
      </HorizontalContainer>
      <PanelItem label="Transform">
        <SegmentedThemedStyled
          data-testid="segmentedTransform"
          isCross
          size="small"
          options={FONT_TRANSFORM_OPTIONS}
          block
          onChange={handleChange('textTransform')}
          value={value.textTransform}
        />
      </PanelItem>
      <PanelItem label="Style">
        <HorizontalContainer>
          <SegmentedThemedStyled
            data-testid="segmentedDecoration"
            isCross
            size="small"
            options={TEXT_DECORATION_OPTIONS}
            block
            onChange={handleChange('textDecoration')}
            value={value.textDecoration}
          />
          <SegmentedThemedStyled
            data-testid="segmentedStyle"
            isCross
            width={64}
            size="small"
            options={FONT_STYLE_OPTIONS}
            block
            onChange={handleChange('textStyle')}
            value={value.textStyle}
          />
        </HorizontalContainer>
      </PanelItem>
      <PanelItem label="Type" data-testid="input-text-type">
        <HorizontalContainer>
          <SegmentedThemedStyled
            size="small"
            options={FONT_TYPE_OPTIONS}
            block
            onChange={handleChange('textType')}
            value={value.textType}
          />
          <Dropdown trigger={['click']} menu={{ items: fontTypeItems(onChangeType) }}>
            <ButtonDropdown
              size="small"
              type={
                FONT_TYPE_ICONS[value?.textType as FONT_TYPE_NAMES]
                  ? 'primary'
                  : 'secondary-outlined'
              }
              icon={
                <Icon
                  name={
                    (value?.textList && FONT_TYPE_ICONS[value?.textType as FONT_TYPE_NAMES]) ||
                    'arrow-bottom_outlined'
                  }
                />
              }
            />
          </Dropdown>
        </HorizontalContainer>
      </PanelItem>
      <PanelItem label="List style" data-testid="input-text-list">
        <HorizontalContainer>
          <SegmentedThemedStyled
            size="small"
            options={FONT_LIST_OPTIONS}
            isCross
            block
            onChange={handleChange('textList')}
            value={value.textList}
          />
          <Dropdown trigger={['click']} menu={{ items: fontListItems(onChangeList) }}>
            <ButtonDropdown
              size="small"
              type={
                FONT_LIST_ICONS[value?.textList as FONT_LIST_NAMES]
                  ? 'primary'
                  : 'secondary-outlined'
              }
              icon={
                <Icon
                  name={
                    (value?.textList && FONT_LIST_ICONS[value?.textList as FONT_LIST_NAMES]) ||
                    'arrow-bottom_outlined'
                  }
                />
              }
            />
          </Dropdown>
        </HorizontalContainer>
      </PanelItem>
    </Root>
  );
};

const ButtonDropdown = styled(Button)`
  && {
    width: 24px;
  }
`;

const SegmentedThemedStyled = styled(Segmented, omitProps('isCross', 'width'))<{
  width?: number;
  isCross?: boolean;
}>`
  flex: 1;
  width: ${p => `${p.width}px` || 'auto'};
  max-width: ${p => `${p.width}px` || 'auto'};
  ${p =>
    p.isCross &&
    css`
      .ant-segmented-item:first-of-type {
        width: 30px;
        max-width: 30px;
      }
    `}
`;

const HorizontalContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .ant-dropdown-menu-item:hover {
    color: #ffffff;
  }
`;

export default TextPropsThemed;

export type { TextPropsThemedValue } from './types';
