const getComponentUrl = (refUrl: string) => {
  if (refUrl.startsWith('/schemas/')) {
    // @ts-ignore
    return refUrl?.slice(9).replaceAll('/', '.');
  }
  return refUrl;
};

export default getComponentUrl;
