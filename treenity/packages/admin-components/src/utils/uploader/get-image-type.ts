import { getImageUrl } from '@treenity/ui-kit/utils';

const isFileKey = (str: string): boolean => {
  const keyRegex = /^[a-f0-9]{64}$/i;
  return keyRegex.test(str);
};

const getBackgroundImageUrl = (backgroundImage?: string) => {
  if (!backgroundImage) return undefined;

  if (isFileKey(backgroundImage)) {
    return getImageUrl(1920, 1080, backgroundImage);
  }

  return backgroundImage;
};

export default getBackgroundImageUrl;
