import { getBase64DecodedServer } from '@/utils/base64-decode.server';

export const parseJwt = (token: string | undefined) => {
  if (token) {
    const base64String = token.split('.')[1];
    const payload = getBase64DecodedServer(base64String);

    return JSON.parse(payload);
  }

  return undefined;
};
