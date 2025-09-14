export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const timeout = (ms: number) =>
  new Promise((res, rej) => setTimeout(() => rej(new Error('Timeout')), ms));
