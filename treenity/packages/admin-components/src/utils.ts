/*
 * Copyright (c) 2024. Treenity Inc.
 */

declare global {
  interface Window {
    ENV: { WS_API_URL: string; VITE_BACKEND_API: string; DOMAIN: string; NODE_ENV: string };
  }
}

export * from './utils/validation-rules';
export * from './utils/uploader/normalize';
export { default as getBackgroundImageUrl } from './utils/uploader/get-image-type';
export { default as ThemeProvider } from './utils/ThemeProvider';
