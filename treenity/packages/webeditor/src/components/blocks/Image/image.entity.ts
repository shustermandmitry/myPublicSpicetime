/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import { Styles } from '@/types/styles';
import {
  DEFAULT_IMAGE_ALT,
  DEFAULT_IMAGE_OBJECT_FIT,
  DEFAULT_IMAGE_SRC,
  ImageProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const ImageType = metaType<ImageEntity>('basic.ui.image');

@entity(ImageType)
export class ImageEntity extends EditorComponentMeta<ImageProps> {
  styles!: Styles;
  /**
   * @title Src
   * @widget treenity.imageUploadInput
   * */
  src: ImageProps['src'] = DEFAULT_IMAGE_SRC;
  /** @title Object fit */
  objectFit: ImageProps['objectFit'] = DEFAULT_IMAGE_OBJECT_FIT;
  /** @title Alt */
  alt: ImageProps['alt'] = DEFAULT_IMAGE_ALT;
}
