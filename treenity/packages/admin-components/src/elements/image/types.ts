export type ObjectFitImageType = 'cover' | 'contain' | 'fill' | 'none';

export interface ImageProps {
  src: string;
  // height: number;
  // width: number;
  objectFit: ObjectFitImageType;
  alt?: string;
}
