import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import './types';
import type { TextProps } from 'antd/es/typography/Text';
import { FC } from 'react';
import {
  ITypographyComponent,
  TagTypes,
  textSizes,
  TFontUnit,
  TFontWeightTextContent,
  TSizeTextContent,
} from './types';

// @ts-ignore
const { Text, Link, Title, Paragraph }: { Text: FC<TextProps> } = Typography;

/**
 * Text wrapper component for rendering typography elements with custom styles.
 *
 * @param {string} [className] - Additional CSS classes.
 * @param {TSizeTextContent} [size='xs'] - Font size, can be Integer or String from Ant Design.
 * @param {TSizeTextContent} [lineHeight='1'] - lineHeight can be a non-integer number and a string with units, like "100%".
 * @param {TSizeTextContent} [letterSpacing] - letterSpacing can be a number.
 * @param {TFontWeightTextContent} [fontWeight] - Font Weight.
 * @param {string} [color] - Text color.
 * @param {PropsWithChildren} [children] - Children.
 * @param {'p' | 'span' | 'div'} [as] - HTML element to render as.
 * @returns {JSX.Element} The rendered TextContent component.
 */

const TextContent = <TagType extends TagTypes>({
  className,
  size = 'xs',
  as,
  children,
  ...restProps
}: ITypographyComponent<TagType>): JSX.Element => (
  <TextStyled
    size={size}
    className={`ant-typography text-content ${className}`}
    as={as || 'p'}
    {...restProps}
  >
    {children}
  </TextStyled>
);

const TextStyled = styled.p<{
  size: TSizeTextContent;
  fontWeight?: TFontWeightTextContent;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  color?: string;
}>`
  margin: 0;
  transition: color 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);

  ${p => {
    const getFontProperty = (property: string, unit?: TFontUnit) => {
      return p.size
        ? typeof p.size === 'number'
          ? // @ts-ignore
            `${p.theme.Typography[`${property}Text${textSizes[p.size].toUpperCase()}`]}${unit || ''}`
          : // @ts-ignore
            `${p.theme.Typography[`${property}Text${p.size.toUpperCase()}`]}${unit || ''}`
        : // @ts-ignore
          `${p.theme.Typography[`${property}TextSM`]}${unit || ''}`;
    };

    return css`
      font-size: ${getFontProperty('fontSize', 'px')};
      line-height: ${getFontProperty('lineHeight')};
      letter-spacing: ${getFontProperty('letterSpacing')};
      font-family: ${p.theme.fontFamily};
      font-weight: ${p.fontWeight || 'inherit'};
      line-height: ${p.lineHeight || 1};

      ${p.letterSpacing &&
      css`
        letter-spacing: ${typeof p.letterSpacing === 'string'
          ? p.letterSpacing
          : `${p.letterSpacing}px`};
      `};
    `;
  }}

  ${p =>
    p.color &&
    css`
      color: ${(p.theme as any)?.token[p.color] || p.color};
    `};
`;

export { Text, Link, Title, Paragraph, TextContent };
