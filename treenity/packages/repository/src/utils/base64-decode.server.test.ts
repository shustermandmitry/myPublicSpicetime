import { getBase64DecodedServer } from './base64-decode.server';

describe('getBase64DecodedServer', () => {
  test('should correctly decode a simple ASCII string', () => {
    const original = 'Hello, World!';
    const encoded = Buffer.from(original).toString('base64');
    expect(getBase64DecodedServer(encoded)).toBe(original);
  });

  test('should correctly decode a string with ASCII special characters', () => {
    const original = '!@#$%^&*()_+';
    const encoded = Buffer.from(original).toString('base64');
    expect(getBase64DecodedServer(encoded)).toBe(original);
  });

  test('should handle an empty string correctly', () => {
    const encoded = Buffer.from('').toString('base64');
    expect(getBase64DecodedServer(encoded)).toBe('');
  });

  test('should return an incorrect result for invalid base64 input without throwing an error', () => {
    const invalidBase64 = 'This is not a valid base64 string!';
    expect(() => getBase64DecodedServer(invalidBase64)).not.toThrow();
    const result = getBase64DecodedServer(invalidBase64);
    expect(result).not.toBe(invalidBase64);
    expect(result.length).toBeGreaterThan(0);
  });
});
