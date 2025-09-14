import { getBox } from 'css-box-model';

interface ZoomConfig {
  autoZoom: number;
  rootHeight: number;
  zoom: number;
}
const MAX_ZOOM_MULTIPLIER = 3;

export const getCanvasZoomOptions = (
  canvasWidth: number,
  frame: HTMLElement | null,
  zoom?: number,
): ZoomConfig => {
  if (!frame) {
    console.warn('Frame element is null. Using default values.');
    return { autoZoom: 1, rootHeight: 0, zoom: 1 };
  }

  const box = getBox(frame);
  const { width: frameWidth, height: frameHeight } = box.contentBox;

  const calculatedZoom = Math.min(frameWidth / canvasWidth, 1);
  const maxZoomAvailable = Math.min(frameWidth / canvasWidth, MAX_ZOOM_MULTIPLIER);

  if (zoom && calculatedZoom < 1 && zoom < calculatedZoom) {
    return {
      autoZoom: calculatedZoom,
      rootHeight: frameHeight / zoom,
      zoom: zoom,
    };
  }

  if (zoom && zoom > maxZoomAvailable) {
    return {
      autoZoom: maxZoomAvailable,
      rootHeight: frameHeight / maxZoomAvailable,
      zoom: zoom,
    };
  }

  if (zoom && zoom < maxZoomAvailable) {
    return {
      autoZoom: zoom,
      rootHeight: frameHeight / zoom,
      zoom: zoom,
    };
  }

  return {
    autoZoom: calculatedZoom,
    rootHeight: frameHeight / calculatedZoom,
    zoom: calculatedZoom,
  };
};
