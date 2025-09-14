import { getBase64DecodedClient } from '@/utils/base64-decode.client';

export const parseJwt = (token: string | undefined) => {
  if (token) {
    const base64String = token.split('.')[1];
    const payload = getBase64DecodedClient(base64String);

    return JSON.parse(payload);
  }

  return undefined;
};
