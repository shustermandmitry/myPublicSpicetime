/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import {
  DEFAULT_VIDEO_AUTOPLAY,
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_LOOP,
  DEFAULT_VIDEO_MUTED,
  DEFAULT_VIDEO_POSTER,
  DEFAULT_VIDEO_SRC,
  type VideoPlayerProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const VideoType = metaType<VideoEntity>('basic.ui.video');

@entity(VideoType)
export class VideoEntity extends EditorComponentMeta<VideoPlayerProps> {
  /** @title Source */
  src: VideoPlayerProps['src'] = DEFAULT_VIDEO_SRC;
  /**
   * @title Poster
   * @widget treenity.imageUploadInput
   * */
  poster: VideoPlayerProps['poster'] = DEFAULT_VIDEO_POSTER;
  /** @title Auto play */
  autoPlay: VideoPlayerProps['autoPlay'] = DEFAULT_VIDEO_AUTOPLAY;
  /** @title Muted */
  muted: VideoPlayerProps['muted'] = DEFAULT_VIDEO_MUTED;
  /** @title Autoplay */
  loop: VideoPlayerProps['loop'] = DEFAULT_VIDEO_LOOP;
  // /** @title Object fit */
  // objectFit: VideoPlayerProps['objectFit'] = DEFAULT_VIDEO_OBJECT_FIT;
  /** @title Height */
  height: VideoPlayerProps['height'] = DEFAULT_VIDEO_HEIGHT;
}
