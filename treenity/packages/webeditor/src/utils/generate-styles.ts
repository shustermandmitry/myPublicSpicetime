import { Styles } from '@/types/styles';
import { getBackgroundImageUrl } from '@treenity/admin-components/utils';
import {
  BackgroundThemedValue,
  BorderThemedValue,
  IPoint,
  PositionThemedValue,
  ShadowThemedValue,
  SizeThemedValue,
  SpacingThemedValue,
  TextPropsThemedValue,
} from '@treenity/admin-components/widgets';

import { generateLayoutStyles } from './generate-layout-styles';

export default function generateStyles({
  background,
  shadow,
  border,
  spacing,
  position,
  size,
  textEditor,
  layout,
}: Partial<Styles>): string {
  const spacingStyles = generateSpacingStyles(spacing);
  const backgroundStyles = generateBackgroundStyles(background);
  const shadowStyles = generateShadowStyles(shadow);
  const borderStyles = generateBorderStyles(border);
  const positionStyles = generatePositionStyles(position);
  const sizeStyles = generateSizeStyles(size);
  const layoutStyles = generateLayoutStyles(layout);
  const textEditorStyles = generateTextEditorStyles(textEditor);

  return `
    ${backgroundStyles}
    ${shadowStyles}
    ${borderStyles}
    ${positionStyles}
    ${sizeStyles}
    ${layoutStyles}
    ${textEditorStyles}
    ${spacingStyles}
  `.trim();
}

function generateSpacingStyles(spacing?: SpacingThemedValue): string {
  if (!spacing) return '';

  const margin = `margin: ${spacing?.margin.top || `0px`} ${spacing?.margin.right || `0px`} ${spacing?.margin.bottom || `0px`} ${spacing?.margin.left || `0px`};`;
  const padding = `padding: ${spacing?.padding.top || `0px`} ${spacing?.padding.right || `0px`} ${spacing?.padding.bottom || `0px`} ${spacing?.padding.left || `0px`};`;
  return `
  ${margin}
  ${padding}
  `;
}

function generateTextEditorStyles(textEditor?: Partial<TextPropsThemedValue>): string {
  if (!textEditor) return '';
  const styles: string[] = [];

  if (textEditor.align) styles.push(`text-align: ${textEditor.align};`);
  if (textEditor.color !== undefined) {
    styles.push(`color: ${textEditor.color === null ? 'transparent' : textEditor.color};`);
  }
  if (textEditor.fontFamily) styles.push(`font-family: ${textEditor.fontFamily};`);
  if (textEditor.fontWeight) styles.push(`font-weight: ${textEditor.fontWeight};`);
  if (textEditor.size) styles.push(`font-size: ${textEditor.size};`);
  if (textEditor.opacity) styles.push(`opacity: ${textEditor.opacity};`);
  if (textEditor.lineHeight) styles.push(`line-height: ${textEditor.lineHeight};`);
  if (textEditor.letterSpacing) styles.push(`letter-spacing: ${textEditor.letterSpacing};`);
  if (textEditor.textTransform) styles.push(`text-transform: ${textEditor.textTransform};`);
  if (textEditor.textStyle) styles.push(`font-style: ${textEditor.textStyle};`);
  if (textEditor.textDecoration) styles.push(`text-decoration: ${textEditor.textDecoration};`);

  return styles.join('\n');
}

function generateSizeStyles(size?: SizeThemedValue): string {
  if (!size) return '';

  const { width, height, overflow, max_height, max_width, min_height, min_width } = size;

  return `
    width: ${width || 'unset'};
    height: ${height || 'unset'};
    max-width: ${max_width || 'unset'};
    max-height: ${max_height || 'unset'};
    min-width: ${min_width || 'unset'};
    min-height: ${min_height || 'unset'};
    overflow: ${overflow};
  `;
}

function generateShadowStyles(shadow?: ShadowThemedValue): string {
  if (!shadow) return '';

  const { blur, color, x, y, spread } = shadow;

  if (!x || !y) {
    return '';
  }

  return `box-shadow: ${x} ${y} ${blur} ${spread} ${color === null ? 'transparent' : color};\n`;
}

function generateBorderStyles(border?: BorderThemedValue): string {
  if (!border) return '';

  const { radius, styles } = border;
  const color = (color?: string | null) => (color === null ? 'transparent' : color);

  return `
    border-radius: ${radius.topLeft} ${radius.topRight} ${radius.bottomRight} ${radius.bottomLeft};
    border-left: ${styles?.left?.width} ${styles?.left?.style} ${color(styles?.left?.color)};
    border-right: ${styles?.right?.width} ${styles?.right?.style} ${color(styles?.right?.color)};
    border-top: ${styles?.top?.width} ${styles?.top?.style} ${color(styles?.top?.color)};
    border-bottom: ${styles?.bottom?.width} ${styles?.bottom?.style} ${color(styles?.bottom?.color)};
  `;
}

function generatePositionStyles(positionStyles?: PositionThemedValue): string {
  if (!positionStyles) return '';

  const { offset, position, zIndex } = positionStyles;
  switch (position) {
    case 'absolute':
      return `
        position: absolute;
        top: ${offset.top};
        left: ${offset.left};
        right: ${offset.right};
        bottom: ${offset.bottom};
        z-index: ${zIndex};
      `;
    case 'fixed':
      return `
        position: fixed;
        top: ${offset.top};
        left: ${offset.left};
        right: ${offset.right};
        bottom: ${offset.bottom};
        z-index: ${zIndex};
      `;
    case 'sticky':
      return `
        position: sticky;
        top: ${offset.top};
        left: ${offset.left};
        right: ${offset.right};
        bottom: ${offset.bottom};
        z-index: ${zIndex};
      `;
    default:
      return `
        position: ${position};
        z-index: ${zIndex};
      `;
  }
}

function filterPoints(point: IPoint | undefined): point is IPoint {
  return Boolean(point && (point.color || point.color === null));
}

function generateBackgroundStyles(background?: BackgroundThemedValue): string {
  if (!background) return '';

  const {
    backgroundColor,
    backgroundSize,
    backgroundGradient,
    backgroundPosition,
    backgroundImage,
  } = background;

  let styles = `
    background-color: ${backgroundColor || 'transparent'};
    background-size: ${backgroundSize || 'auto'};
  `;

  if (backgroundImage?.key) {
    styles += `background-image: url(${getBackgroundImageUrl(backgroundImage.key)});\n`;
  }

  if (backgroundPosition?.positions) {
    styles += `background-position: ${backgroundPosition.positions.x} ${backgroundPosition.positions.y};\n`;
  }

  if (backgroundPosition?.repeat) {
    styles += `background-repeat: ${backgroundPosition.repeat};\n`;
  }

  if (backgroundGradient) {
    const { angle, points } = backgroundGradient;
    const gradientPoints = Object.values(points)
      .filter(filterPoints)
      .map(point => `${point.color === null ? 'transparent' : point.color} ${point.position}%`)
      .join(', ');

    if (gradientPoints) {
      styles += `
        background-image: linear-gradient(
          ${angle}deg,
          ${gradientPoints}
        );
      `;
    }
  }

  return styles.trim();
}
