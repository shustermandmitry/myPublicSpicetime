export function resolvePixelValue(value: number | string) {
  return typeof value === 'string' && value.endsWith('px') ? value : value + 'px';
}
