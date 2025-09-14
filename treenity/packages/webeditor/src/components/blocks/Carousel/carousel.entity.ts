/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import {
  type CarouselProps,
  DEFAULT_CAROUSEL_AUTOPLAY,
  DEFAULT_CAROUSEL_DELAY,
  DEFAULT_CAROUSEL_DIRECTION,
  DEFAULT_CAROUSEL_HEIGHT_IMAGE,
  DEFAULT_CAROUSEL_LIST,
  DEFAULT_CAROUSEL_LOOP,
  DEFAULT_CAROUSEL_NAV_TYPE,
  DEFAULT_CAROUSEL_SHOW_NAVIGATE,
  DEFAULT_CAROUSEL_SHOW_PAGINATION,
  DEFAULT_CAROUSEL_WIDTH_IMAGE,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const CarouselType = metaType<CarouselEntity>('advanced.carousel');

@entity(CarouselType)
export class CarouselEntity extends EditorComponentMeta<CarouselProps> {
  /**
   * @title Slides
   * @widget treenity.imageUploadInput
   * */
  list: CarouselProps['list'] = DEFAULT_CAROUSEL_LIST;
  /** @title Width image */
  widthImage: CarouselProps['widthImage'] = DEFAULT_CAROUSEL_WIDTH_IMAGE;
  /** @title Height image*/
  heightImage: CarouselProps['heightImage'] = DEFAULT_CAROUSEL_HEIGHT_IMAGE;
  /** @title Nav type*/
  navType: CarouselProps['navType'] = DEFAULT_CAROUSEL_NAV_TYPE;
  /** @title Direction*/
  direction: CarouselProps['direction'] = DEFAULT_CAROUSEL_DIRECTION;
  /** @title Disable nav buttons*/
  hideNavigate: CarouselProps['hideNavigate'] = DEFAULT_CAROUSEL_SHOW_NAVIGATE;
  /** @title Disable nav dots/numbers*/
  hidePagination: CarouselProps['hidePagination'] = DEFAULT_CAROUSEL_SHOW_PAGINATION;
  /** @title Auto play slides*/
  autoplay: CarouselProps['autoplay'] = DEFAULT_CAROUSEL_AUTOPLAY;
  /** @title Infinite repeat slides*/
  loop: CarouselProps['loop'] = DEFAULT_CAROUSEL_LOOP;
  /** @title Duration*/
  delay: CarouselProps['delay'] = DEFAULT_CAROUSEL_DELAY;
}
