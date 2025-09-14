/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { isClient } from '@treenity/js-shared';

// @ts-ignore
const API_URL = () => isClient ? window.ENV.WS_API_URL : process.env.CLUSTER_API_URL;

export const createImageUrlFn =
  (defaultImage: string, defaultWidth: number, defaultHeight: number) =>
  (
    key?: string | null,
    width: number = defaultWidth,
    height: number = defaultHeight,
    defaultImg?: string,
  ) => {
    if (typeof key !== 'string' || !key || key.length < 1) {
      return defaultImg || defaultImage;
    }

    if (key?.startsWith('https://')) {
      return key;
    }

    return getImageUrl(width, height, key);
  };

//This action for get image from server
export const getImageUrl = (width: number, height: number, key: string) =>
  // `${API_URL()}/v1/image/${width}/${height}?key=${encodeURIComponent(key)}`;
  `${API_URL()}/api/sys/file?key=${encodeURIComponent(key)}&width=${width}&height=${height}`;

//This method for upload image
export const getImageAction = () => `${API_URL()}/api/sys/file`;
