import getImageType from '@/utils/uploader/get-image-type';
import styled from '@emotion/styled';
import { omitProps } from '@treenity/ui-kit/utils';
import React from 'react';
import { EditorProps } from '../EditorProps';
import { DEFAULT_IMAGE_SRC } from './default-data';
import { ImageProps, ObjectFitImageType } from './types';

const Image: EditorProps<ImageProps> = ({ mergedMeta: { src, alt, ...restProps }, style }) => {
  return (
    <ImageStyled
      {...restProps}
      style={style}
      src={getImageType(src || DEFAULT_IMAGE_SRC)}
      alt={alt || src}
    />
  );
};

const ImageStyled = styled('img', omitProps('objectFit'))<{
  objectFit: ObjectFitImageType;
}>`
  width: 100%;
  object-fit: ${p => p.objectFit};
  user-select: none;
`;

export default Image;
