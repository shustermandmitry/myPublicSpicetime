import { readFile } from 'node:fs/promises';

export async function initialize(data) {
  // console.log('initialize', data);
  // Receives data from `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // console.log('resolve', specifier, context, nextResolve);
  return nextResolve(specifier);
  // Take an `import` or `require` specifier and resolve it to a URL.
}

const _loaded = {};

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url);

  console.log('load', context, url, result.responseURL);

  const url1 = new URL(result.responseURL ?? url);
  if (result.format === 'commonjs' && !result.source && !_loaded[url1]) {
    result.source = await readFile(url1);
    _loaded[url1] = true;
  }
  return result;
}

