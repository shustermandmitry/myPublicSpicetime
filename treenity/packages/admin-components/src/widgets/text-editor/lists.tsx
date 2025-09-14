/*
 * Copyright (c) 2024. Treenity Inc.
 */

import Icon from '@/components/icon';
import type { IconNamesMap } from '@/components/icon/icon-component/types';
import styled from '@emotion/styled';
import { MenuProps } from 'antd';
import React from 'react';
import { FONT_LIST_NAMES, FONT_TYPE_NAMES } from './types';

export const ALIGN_OPTIONS = [
  {
    value: 'start',
    icon: <Icon name="align-left_outlined" />,
  },
  {
    value: 'center',
    icon: <Icon name="align-center_outlined" />,
  },
  {
    value: 'end',
    icon: <Icon name="align-right_outlined" />,
  },
  {
    value: 'justify',
    icon: <Icon name="align-justify_outlined" />,
  },
];
export const FONT_FAMILY_OPTIONS = [
  {
    value: 'italic',
    label: 'Italic',
  },
  {
    value: 'roboto',
    label: 'Roboto',
  },
  {
    value: 'openSans',
    label: 'Open Sans',
  },
  {
    value: 'inter',
    label: 'Inter',
  },
];
export const FONT_TRANSFORM_OPTIONS = [
  {
    value: 'none',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'capitalize',
    label: 'Ab',
  },
  {
    value: 'uppercase',
    label: 'AB',
  },
  {
    value: 'lowercase',
    label: 'ab',
  },
];
export const FONT_WEIGHT_OPTIONS = [
  {
    value: '100',
    label: 'Thin 100',
  },
  {
    value: '200',
    label: 'Extra light 200',
  },
  {
    value: '300',
    label: 'Light 300',
  },
  {
    value: '400',
    label: 'Normal 400',
  },
  {
    value: '500',
    label: 'Medium 500',
  },
  {
    value: '600',
    label: 'Semi-bold 600',
  },
  {
    value: '700',
    label: 'Bold 700',
  },
  {
    value: '800',
    label: 'Extra-bold 800',
  },
  {
    value: '900',
    label: 'Black 900',
  },
];

export const TEXT_DECORATION_OPTIONS = [
  {
    value: 'none',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'overline',
    icon: <Icon name="overline_outlined" />,
  },
  {
    value: 'underline',
    icon: <Icon name="underline_outlined" />,
  },
  {
    value: 'line-through',
    icon: <Icon name="strike_outlined" />,
  },
];
export const FONT_STYLE_OPTIONS = [
  {
    value: 'normal',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'italic',
    icon: <Icon name="italics_outlined" />,
  },
];
export const FONT_TYPE_OPTIONS = [
  {
    value: 'text',
    icon: <Icon name="par_outlined" />,
  },
  {
    value: 'link',
    icon: <Icon name="bundle_outlined" />,
  },
  {
    value: 'h1',
    icon: <Icon name="add-headlines-1_outlined" />,
  },
  {
    value: 'h2',
    icon: <Icon name="add-headlines-2_outlined" />,
  },
];
export const FONT_LIST_OPTIONS = [
  {
    value: 'none',
    icon: <Icon name="x-axis_outlined" />,
  },
  {
    value: 'listCircle',
    icon: <Icon name="add-list-circle-filled_outlined" />,
  },
  {
    value: 'listSquare',
    icon: <Icon name="add-list-square-filled_outlined" />,
  },
  {
    value: 'listLettersDots',
    icon: <Icon name="add-list-letters-dots_outlined" />,
  },
  {
    value: 'numberedList',
    icon: <Icon name="add-numbered-list_outlined" />,
  },
];

export const fontTypeItems = (onChangeType: (key: string) => void): MenuProps['items'] => [
  {
    key: 'code',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.code} />
        <p>Code</p>
      </DropdownItem>
    ),
  },
  {
    key: 'quote',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.quote} />
        <p>Quoting</p>
      </DropdownItem>
    ),
  },
  {
    key: 'h3',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.h3} />
        <p>Title H3</p>
      </DropdownItem>
    ),
  },
  {
    key: 'h4',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.h4} />
        <p>Title H4</p>
      </DropdownItem>
    ),
  },
  {
    key: 'h5',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.h5} />
        <p>Title H5</p>
      </DropdownItem>
    ),
  },
  {
    key: 'h6',
    onClick: ({ key }) => onChangeType(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_TYPE_ICONS.h6} />
        <p>Title H6</p>
      </DropdownItem>
    ),
  },
];

export const fontListItems = (onChangeList: (key: string) => void): MenuProps['items'] => [
  {
    key: 'addListCircleOutlined',
    onClick: ({ key }) => onChangeList(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_LIST_ICONS.addListCircleOutlined} />
        <p>Dots list</p>
      </DropdownItem>
    ),
  },
  {
    key: 'addListSquareOutlined',
    onClick: ({ key }) => onChangeList(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_LIST_ICONS.addListSquareOutlined} />
        <p>Squares list</p>
      </DropdownItem>
    ),
  },
  {
    key: 'listNumbersParenthesis',
    onClick: ({ key }) => onChangeList(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_LIST_ICONS.listNumbersParenthesis} />
        <p>Numbers list</p>
      </DropdownItem>
    ),
  },
  {
    key: 'listLettersParenthesis',
    onClick: ({ key }) => onChangeList(key),
    label: (
      <DropdownItem>
        <DropdownIcon name={FONT_LIST_ICONS.listLettersParenthesis} />
        <p>Letters list</p>
      </DropdownItem>
    ),
  },
];

export const FONT_TYPE_ICONS: { [name in FONT_TYPE_NAMES]: IconNamesMap } = {
  code: 'code-2_outlined',
  quote: 'add-quote_outlined',
  h3: 'add-headlines-3_outlined',
  h4: 'add-headlines-4_outlined',
  h5: 'add-headlines-5_outlined',
  h6: 'add-headlines-6_outlined',
};

export const FONT_LIST_ICONS: { [name in FONT_LIST_NAMES]: IconNamesMap } = {
  addListCircleOutlined: 'add-list-circle-outlined_outlined',
  addListSquareOutlined: 'add-list-square-outlined_outlined',
  listNumbersParenthesis: 'add-list-numbers-parenthesis_outlined',
  listLettersParenthesis: 'add-list-letters-parenthesis_outlined',
};

const DropdownIcon = styled(Icon)`
  && > i {
    font-size: 12px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  gap: 2px;

  p {
    margin: 0;
    white-space: nowrap;
    font-weight: 700;
  }
`;
