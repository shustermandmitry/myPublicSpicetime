import { types } from '@treenity/core';
import fetch from 'cross-fetch';
import { SynchronousPromise } from 'synchronous-promise';
import { JsonObjectSchema } from './types';
import getComponentUrl from './utils/getComponentUrl';

const BASE_SCHEMAS_URL = 'https://treenity.pro';

export interface IRefResolverOptions {
  item: JsonObjectSchema;
  schema: JsonObjectSchema;
}

const refResolver = (options: IRefResolverOptions): Promise<JsonObjectSchema> => {
  // @ts-ignore
  const refUrl = options.item.$ref;
  if (!refUrl) {
    throw new Error('refResolver: refUrl is empty');
  }
  let url = refUrl;
  if (url.startsWith(BASE_SCHEMAS_URL)) {
    url = url.slice(BASE_SCHEMAS_URL.length);
  }

  if (url.startsWith('#/$defs')) {
    const defsKey = url.slice(8);
    const definitions = options.schema!.$defs?.[defsKey];
    if (!definitions) {
      throw new Error(`refResolver: $defs not found by key: ${defsKey}`);
    }
    return SynchronousPromise.resolve(definitions as JsonObjectSchema);
  } else if (url.startsWith('#/definitions')) {
    const defsKey = url.slice(14);
    const definitions = options.schema!.definitions?.[defsKey];
    if (!definitions) {
      throw new Error(`refResolver: definitions not found by key: ${defsKey}`);
    }
    // @ts-ignore
    return SynchronousPromise.resolve(definitions);
  } else if (url.startsWith('/schemas/')) {
    // @ts-ignore
    const schemaUrl = getComponentUrl(url);
    return types.schema.get(schemaUrl).then(meta => {
      if (meta.length) return meta[0];
      throw new Error(`refResolver: schema not found by url: ${schemaUrl}`);
    });
  } else {
    return request(url);
  }
};

const request = (uri: string) =>
  fetch(uri, {
    method: 'GET',
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    })
    .catch(e => {
      throw new Error(e.message);
    });

export default refResolver;
