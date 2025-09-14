import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import React from 'react';
import ReactPlayer from 'react-player';
import { EditorProps } from '../EditorProps';
import { VideoPlayerProps } from './types';

/**
 * Video component for media playback based on ReactPlayer
 * @component
 *
 * @param {Object} props - Component properties
 * @param {Object} props.mergedMeta - Object containing video configuration
 * @param {string} props.mergedMeta.src - URL or path to video file
 * @param {string} [props.mergedMeta.poster] - URL of preview image for video
 * @param {boolean} [props.mergedMeta.autoPlay=false] - Enable autoplay
 * @param {boolean} [props.mergedMeta.muted=true] - Mute video audio
 * @param {boolean} [props.mergedMeta.loop=false] - Enable video looping
 * @param {string} [props.mergedMeta.objectFit='contain'] - CSS object-fit property value
 * @param {string} [props.mergedMeta.height='500px'] - Height of video player
 *
 * @example
 * <Video
 *   mergedMeta={{
 *     src: "https://example.com/video.mp4",
 *     poster: "https://example.com/preview.jpg",
 *     autoPlay: true,
 *     muted: false,
 *     loop: true,
 *     objectFit: "cover",
 *     height: "400px"
 *   }}
 * />
 *
 * @returns {JSX.Element} Video player component
 */

const Video: EditorProps<VideoPlayerProps> = ({
  mergedMeta: {
    src,
    poster,
    autoPlay = false,
    muted = true,
    loop = false,
    objectFit = 'contain',
    height = '500px',
  },
}) => {
  return (
    <ReactPlayerStyled
      objectFit={objectFit}
      url={src}
      controls={false}
      playing={autoPlay}
      loop={loop}
      light={poster}
      muted={autoPlay ? false : muted}
      width="100%"
      height={height}
    />
  );
};

const ReactPlayerStyled = styled(ReactPlayer, omitProps('objectFit'))<{ objectFit: string }>`
  object-fit: ${p => p.objectFit};
`;

export default Video;
