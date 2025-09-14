import { InputValueWithUnit, UnitsType } from './index';

/**
 * Parses a string value with a unit into an object containing the numeric value and unit.
 *
 * @param {string | undefined} value - The input string to parse (e.g., '10px', '30em', 'auto').
 * @returns {InputValueWithUnit} An object containing the parsed numeric value, unit and isAuto flag.
 *
 * @example
 * parseValueWithUnit('10px') // returns { numericValue: 10, unit: 'px', isAuto: false }
 * parseValueWithUnit('30em') // returns { numericValue: 30, unit: 'em', isAuto: false }
 * parseValueWithUnit('auto') // returns { numericValue: null, unit: 'auto', isAuto: true }
 * parseValueWithUnit('') // returns { numericValue: null, unit: 'px', isAuto: false }
 */
const parseValueWithUnit = (value: string | undefined): InputValueWithUnit => {
  if (!value) return { numericValue: null, unit: 'px', isAuto: false };

  if (value === 'auto') {
    return { numericValue: null, unit: 'auto', isAuto: true };
  }

  const match = value.match(/^(-?\d*\.?\d*)(\D+)?$/);

  if (match && match[1]) {
    const numericPart = match[1];
    const unitPart = match[2];

    // Handle case where there's a decimal point but no digits after it
    const numericValue = numericPart.endsWith('.')
      ? parseInt(numericPart)
      : parseFloat(numericPart);

    const unit = (unitPart || 'px') as UnitsType;

    return {
      numericValue: isNaN(numericValue) ? null : numericValue,
      unit,
      isAuto: false,
    };
  }

  return { numericValue: null, unit: 'px', isAuto: false };
};

export default parseValueWithUnit;
