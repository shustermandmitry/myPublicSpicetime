import { Buffer } from 'buffer';
import { getBase64DecodedClient } from './base64-decode.client';

describe('getBase64DecodedClient', () => {
  beforeEach(() => {
    // @ts-ignore
    global.window = {
      atob: jest.fn((data: string) => Buffer.from(data, 'base64').toString('binary')),
    };
  });

  afterEach(() => {
    delete (global as any).window;
  });

  test('should correctly decode a simple string', () => {
    const original = 'Hello, World!';
    const encoded = Buffer.from(original).toString('base64');
    expect(getBase64DecodedClient(encoded)).toBe(original);
    expect(window.atob).toHaveBeenCalledWith(encoded);
  });

  test('should correctly decode a string with special characters', () => {
    const original = '!@#$%^&*()_+';
    const encoded = Buffer.from(original).toString('base64');
    expect(getBase64DecodedClient(encoded)).toBe(original);
    expect(window.atob).toHaveBeenCalledWith(encoded);
  });

  test('should throw an error for invalid base64 input', () => {
    const invalidBase64 = 'This is not a valid base64 string!';
    (window.atob as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid base64');
    });
    expect(() => getBase64DecodedClient(invalidBase64)).toThrow();
    expect(window.atob).toHaveBeenCalledWith(invalidBase64);
  });

  test('should handle an empty string correctly', () => {
    const encoded = Buffer.from('').toString('base64');
    expect(getBase64DecodedClient(encoded)).toBe('');
    expect(window.atob).toHaveBeenCalledWith(encoded);
  });
});
