export const getBase64DecodedServer = (base64: string): string =>
  Buffer.from(base64, 'base64').toString('ascii');
