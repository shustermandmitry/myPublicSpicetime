/*
 * Copyright (c) 2024. Treenity Inc.
 */

import parseValueWithUnit from '../parse-value';

describe('parseValueWithUnit', () => {
  it('parses valid input with px unit', () => {
    const result = parseValueWithUnit('10px');
    expect(result).toEqual({ numericValue: 10, unit: 'px' });
  });

  it('parses valid input with em unit', () => {
    const result = parseValueWithUnit('2.5em');
    expect(result).toEqual({ numericValue: 2.5, unit: 'em' });
  });

  it('parses valid input with % unit', () => {
    const result = parseValueWithUnit('75%');
    expect(result).toEqual({ numericValue: 75, unit: '%' });
  });

  it('parses valid input with rem unit', () => {
    const result = parseValueWithUnit('1.2rem');
    expect(result).toEqual({ numericValue: 1.2, unit: 'rem' });
  });

  it('parses valid input with vw unit', () => {
    const result = parseValueWithUnit('50vw');
    expect(result).toEqual({ numericValue: 50, unit: 'vw' });
  });

  it('parses valid input with vh unit', () => {
    const result = parseValueWithUnit('25vh');
    expect(result).toEqual({ numericValue: 25, unit: 'vh' });
  });

  it('parses valid input with no unit (defaults to px)', () => {
    const result = parseValueWithUnit('15');
    expect(result).toEqual({ numericValue: 15, unit: 'px' });
  });

  it('parses negative values correctly', () => {
    const result = parseValueWithUnit('-5px');
    expect(result).toEqual({ numericValue: -5, unit: 'px' });
  });

  it('handles undefined input', () => {
    const result = parseValueWithUnit(undefined);
    expect(result).toEqual({ numericValue: null, unit: 'px' });
  });

  it('handles empty string input', () => {
    const result = parseValueWithUnit('');
    expect(result).toEqual({ numericValue: null, unit: 'px' });
  });

  it('handles invalid input (non-numeric)', () => {
    const result = parseValueWithUnit('abc');
    expect(result).toEqual({ numericValue: null, unit: 'px' });
  });

  it('handles input with only unit (no number)', () => {
    const result = parseValueWithUnit('px');
    expect(result).toEqual({ numericValue: null, unit: 'px' });
  });

  it('handles input with decimal point but no following digits', () => {
    const result = parseValueWithUnit('10.px');
    expect(result).toEqual({ numericValue: 10, unit: 'px' });
  });

  it('handles input with decimal point and following digits', () => {
    const result = parseValueWithUnit('10.5px');
    expect(result).toEqual({ numericValue: 10.5, unit: 'px' });
  });
});
