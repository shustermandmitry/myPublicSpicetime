import { IRedirectOptions } from '@/context/LayoutContext';

export const LINK_REGEX: Record<string, RegExp> = {
  phone:
    /^tel:\+(?:[1-9]\d{0,2})[-. ]?[(]?(?:[0-9]\d{2})[)]?[-. ]?(?:[0-9]\d{2})[-. ]?(?:[0-9]\d{1})[-. ]?(?:[0-9]\d{1})$/,
  mail: /^(mailto:[a-zA-Z0-9])(?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/,
  section: /^#[a-zA-Z][-a-zA-Z0-9_]*$/g,
  page: /^\//,
  url: /^(https?:\/\/)([\da-z.-]+)\.?([a-z.]{2,6})?(:\d{1,5})?([\/\w\.-]*)*\/?$/,
};

const hasUrlProtocol = (value?: string): boolean => Boolean(value?.match(LINK_REGEX.url));

type LinkItem = { link: string; [key: string]: any };
type ConvertUrlApi = {
  string: (path: string) => string;
  object: <T extends LinkItem>(value: T) => T;
  array: <T extends LinkItem>(menu: Array<T>) => Array<T>;
};

const convertUrl = (redirectOptions?: IRedirectOptions): ConvertUrlApi => {
  const { url: redirectUrl, replaceKey } = redirectOptions ?? {};
  const canRedirect = Boolean(redirectUrl && replaceKey);

  const replaceUrl = (path?: string): string => {
    const normalizedPath = path?.startsWith('/') ? path.slice(1) : path;

    if (
      normalizedPath?.match(LINK_REGEX.mail) ||
      normalizedPath?.match(LINK_REGEX.phone) ||
      normalizedPath?.match(LINK_REGEX.section)
    ) {
      return normalizedPath;
    }

    if (!canRedirect || !normalizedPath || hasUrlProtocol(normalizedPath)) {
      return normalizedPath ?? '';
    }

    return redirectUrl!.replace(replaceKey!, normalizedPath);
  };

  return {
    string: replaceUrl,
    object: value => {
      if (!canRedirect) return value;
      return {
        ...value,
        link: replaceUrl(value.link),
      };
    },

    array: menu => {
      if (!canRedirect) return menu;
      return menu.map(item => ({
        ...item,
        link: replaceUrl(item.link),
      }));
    },
  };
};

export default convertUrl;
