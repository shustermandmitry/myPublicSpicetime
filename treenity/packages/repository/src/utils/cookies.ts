import { createContext, useContext } from 'react';

export interface ParsedCookies {
  [key: string]: string;
}

export type Cookies = ParsedCookies & {
  (key: string, value: string, age?: number): string | undefined;
};

export const createCookies = (parsed: ParsedCookies, _setCookie?: typeof setCookie): Cookies => {
  const cookies = (key: string, value: string, age: number = 2629743): string | undefined => {
    const old = parsed[key];
    (cookies as any)[key] = value;
    return _setCookie?.(key, value, age) ?? old;
  };

  return Object.assign(cookies as Cookies, parsed);
};

export function parseCookies(cookieHeader: string): ParsedCookies {
  const cookies: ParsedCookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    const value = parts.join('=');
    if (name) {
      cookies[name] = value;
    }
  });
  return cookies;
}

export const setCookie = (
  key: string,
  value: string,
  age: number = 2629743,
): string | undefined => {
  if (typeof window === 'undefined') {
    return;
  }

  document.cookie = `${key}=${value}; path=/;Max-Age=${age}`;
};

export function useCookie(): Cookies {
  const data = useContext(CookieContext);
  if (!data) {
    throw new Error('useCookie must be used within a Cookie Provider');
  }

  return data;
}

export const CookieContext = createContext<Cookies>(null!);
