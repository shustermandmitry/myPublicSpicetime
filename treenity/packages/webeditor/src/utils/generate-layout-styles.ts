import {
  GridSettingsCRSizeType,
  IGridSettingsArea,
  IGridSettingsValue,
  IGridSettingsValueCR,
  LayoutThemedValue,
} from '@treenity/admin-components/widgets';

export function generateLayoutStyles(layout?: LayoutThemedValue): string {
  if (!layout) return '';
  const { display, align, gap, order } = layout;

  const styles = [
    `display: ${display};`,
    order ? `order: ${order};` : '',
    generateGapStyle(gap),
    generateDisplaySpecificStyles(display, layout),
  ];

  return styles.filter(Boolean).join('\n').trim();
}

const generateGapStyle = (gap?: { row: string; column: string }) =>
  gap ? `gap: ${gap.row} ${gap.column};` : '';

const generateDisplaySpecificStyles = (
  display: string,
  { direction, align, gridSettings, columns, rows }: Partial<LayoutThemedValue>,
) => {
  switch (display) {
    case 'flex':
      return generateFlexStyles(direction, align);
    case 'grid':
      return generateGridStyles(direction, gridSettings, columns, rows, align);
    default:
      return '';
  }
};

const generateFlexStyles = (direction?: string, align?: string) => {
  const flexDirection = `
  ${direction ? `flex-direction: ${direction};` : ''}
`;

  const generateFlexAlignStyle = () => {
    if (!align) return '';
    const [alignX, alignY] = align.split('_');

    const getJustifyContent = () => {
      if (direction === 'column') {
        if (alignX === 'left') {
          return 'start';
        }
        if (alignX === 'right') {
          return 'end';
        }
      }
      return alignX;
    };

    return `
      justify-content: ${getJustifyContent()};
      align-items: ${alignY};
  `;
  };

  return `
  ${flexDirection}
  ${generateFlexAlignStyle()}
  `;
};
// ${align ? `align-items: ${align.split('_')[1]};` : ''}

const generateGridStyles = (
  direction?: string,
  gridSettings?: IGridSettingsValue,
  columns?: string,
  rows?: string,
  align?: string,
) => {
  const gridSettingsStyles = gridSettings
    ? `
      ${gridSettings.columns.length > 0 ? `grid-template-columns: ${generateGridTemplate(gridSettings.columns)};` : ''}
      ${gridSettings.rows.length > 0 ? `grid-template-rows: ${generateGridTemplate(gridSettings.rows)};` : ''}
      ${
        gridSettings.areas && gridSettings.areas.length > 0
          ? `grid-template-areas: ${generateGridAreas(gridSettings.areas)};`
          : ''
      }
    `
    : '';

  const gridAlignmentStyles = `
    ${columns ? `justify-content: ${columns};` : ''}
    ${rows ? `align-content: ${rows};` : ''}
  `;

  const gridDirectionStyles = direction
    ? `
    grid-auto-flow: ${direction};
  `
    : '';

  const generateGridAlignStyle = () => {
    if (!align) return '';
    const [alignX, alignY] = align.split('_');

    return `
      justify-items: ${alignX};
      align-items: ${alignY};
  `;
  };

  return `
    ${gridSettingsStyles}
    ${gridAlignmentStyles}
    ${gridDirectionStyles}
    ${generateGridAlignStyle()}
  `;
};

function generateGridTemplate(items: IGridSettingsValueCR[]): string {
  return items
    .map(item => {
      switch (item.format) {
        case 'fixed':
          return item.size as string;
        case 'auto':
          return 'auto';
        case 'min-max':
          // eslint-disable-next-line no-case-declarations
          const { min, max } = item.size as GridSettingsCRSizeType;
          return `minmax(${min}, ${max})`;
        default:
          return '1fr';
      }
    })
    .join(' ');
}

function generateGridAreas(areas: IGridSettingsArea[]): string {
  const maxRows = Math.max(...areas.map(area => area.rows_end));
  const maxCols = Math.max(...areas.map(area => area.columns_end));

  const grid = Array.from({ length: maxRows }, () => Array(maxCols).fill('.'));

  areas.forEach((area, index) => {
    for (let row = area.rows_start - 1; row < area.rows_end; row++) {
      for (let col = area.columns_start - 1; col < area.columns_end; col++) {
        grid[row][col] = `area${index + 1}`;
      }
    }
  });

  return grid.map(row => `'${row.join(' ')}'`).join(' ');
}
