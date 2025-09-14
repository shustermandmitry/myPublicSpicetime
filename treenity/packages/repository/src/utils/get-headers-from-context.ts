import { HookContext } from '@/declarations';

const getHeadersFromContext = (context: HookContext) => {
  const headers = context.arguments.find(arg => !!arg?.headers)?.headers;
  if (!headers) {
    return {};
  }

  return headers;
};

export default getHeadersFromContext;
