import { parseJwt } from './parse-jwt';
import { getBase64DecodedClient } from './base64-decode.client';
import { getBase64DecodedServer } from './base64-decode.server';
import { isClient } from '@treenity/js-shared';

jest.mock('./base64-decode.client');
jest.mock('./base64-decode.server');

const mockPayload = { userId: '123', username: 'testuser' };
const mockBase64Payload = Buffer.from(JSON.stringify(mockPayload)).toString('base64');
const mockToken = `header.${mockBase64Payload}.signature`;

describe('parseJwt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly parse a valid JWT token', () => {
    const mockDecode = isClient ? getBase64DecodedClient : getBase64DecodedServer;
    (mockDecode as jest.Mock).mockImplementation(str => Buffer.from(str, 'base64').toString());

    const result = parseJwt(mockToken);

    expect(result).toEqual(mockPayload);
    expect(mockDecode).toHaveBeenCalled();
  });

  test('should handle tokens with URL-safe base64 encoding', () => {
    const urlSafeBase64 = mockBase64Payload.replace(/\+/g, '-').replace(/\//g, '_');
    const urlSafeToken = `header.${urlSafeBase64}.signature`;
    const mockDecode = isClient ? getBase64DecodedClient : getBase64DecodedServer;
    (mockDecode as jest.Mock).mockImplementation(str =>
      Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString(),
    );

    const result = parseJwt(urlSafeToken);

    expect(result).toEqual(mockPayload);
    expect(mockDecode).toHaveBeenCalled();
  });

  test('should return undefined for undefined token', () => {
    const result = parseJwt(undefined);

    expect(result).toBeUndefined();
    expect(getBase64DecodedClient).not.toHaveBeenCalled();
    expect(getBase64DecodedServer).not.toHaveBeenCalled();
  });

  test('should throw an error for invalid JSON in payload', () => {
    const invalidPayload = 'not a json';
    const invalidToken = `header.${Buffer.from(invalidPayload).toString('base64')}.signature`;
    const mockDecode = isClient ? getBase64DecodedClient : getBase64DecodedServer;
    (mockDecode as jest.Mock).mockReturnValue(invalidPayload);

    expect(() => parseJwt(invalidToken)).toThrow(SyntaxError);
  });
});
