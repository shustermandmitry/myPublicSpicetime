export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  objectFit?: 'contain' | 'cover';
  showProgress?: boolean;
  onProgress?(progress: { currentTime: number; duration: number; percentage: number }): void;
  onFinish?(): void;
  backgroundColor?: string;
  height?: string;
}
