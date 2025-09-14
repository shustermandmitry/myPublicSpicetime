import { LayoutThemedValue } from '@treenity/admin-components/widgets';

import { generateLayoutStyles } from '../generate-layout-styles';

describe('generateLayoutStyles', () => {
  it('should return an empty string for undefined layout', () => {
    expect(generateLayoutStyles(undefined)).toBe('');
  });

  it('should return only display style for layout with display property', () => {
    expect(
      generateLayoutStyles({
        display: 'block',
        direction: 'column',
      } as LayoutThemedValue),
    ).toBe('display: block;');
  });

  it('should generate basic display style', () => {
    const layout = { display: 'flex' };
    expect(generateLayoutStyles(layout as LayoutThemedValue)).toBe('display: flex;');
  });

  it('should generate styles with order', () => {
    const layout = { display: 'flex', order: '2' };
    expect(generateLayoutStyles(layout as LayoutThemedValue)).toBe('display: flex;\norder: 2;');
  });

  it('should generate styles with gap', () => {
    const layout = {
      display: 'flex',
      gap: { row: '10px', column: '20px' },
    };
    expect(generateLayoutStyles(layout as LayoutThemedValue)).toBe(
      'display: flex;\ngap: 10px 20px;',
    );
  });

  it('should generate styles with align', () => {
    const layout = { display: 'flex', align: 'center_start' };
    expect(generateLayoutStyles(layout as LayoutThemedValue)).toContain('justify-content: center;');
    expect(generateLayoutStyles(layout as LayoutThemedValue)).toContain('align-content: start;');
  });

  it('should generate flex styles', () => {
    const layout = {
      display: 'flex',
      direction: 'column',
      align: 'center_center',
    };

    const result = generateLayoutStyles(layout as LayoutThemedValue);
    expect(result).toContain('display: flex;');
    expect(result).toContain('flex-direction: column;');
    expect(result).toContain('align-items: center;');
    expect(result).toContain('justify-content: center;');
  });

  // it('should generate grid styles', () => {
  //   const layout = {
  //     display: 'grid',
  //     grid: { column: '100px', row: '50px' },
  //     columns: 'start',
  //     rows: 'end',
  //   };
  //
  //   const result = generateLayoutStyles(layout as LayoutThemedValue);
  //   expect(result).toContain('display: grid;');
  //   expect(result).toContain('grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));');
  //   expect(result).toContain('grid-auto-rows: 50px;');
  //   expect(result).toContain('justify-items: start;');
  //   expect(result).toContain('align-items: end;');
  // });

  it('should generate grid styles with grid settings', () => {
    const layout = {
      display: 'grid',
      gridSettings: {
        columns: [{ format: 'fixed', size: '100px' }, { format: 'auto' }],
        rows: [{ format: 'min-max', size: { min: '50px', max: '100px' } }],
        areas: [{ columns_start: 1, columns_end: 2, rows_start: 1, rows_end: 2 }],
      },
    };
    const result = generateLayoutStyles(layout as LayoutThemedValue);
    expect(result).toContain('display: grid;');
    expect(result).toContain('grid-template-columns: 100px auto;');
    expect(result).toContain('grid-template-rows: minmax(50px, 100px);');
    expect(result).toContain("grid-template-areas: 'area1 area1' 'area1 area1';");
  });
});
