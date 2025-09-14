// @ts-ignore window is ok here
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;
export const isTesting = process.env.NODE_ENV === 'test';
