const parseJwt = (token: string | undefined) => {
  if (token) {
    const base64String = token.split('.')[1];
    return JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
  }

  return undefined;
};

export default parseJwt;
