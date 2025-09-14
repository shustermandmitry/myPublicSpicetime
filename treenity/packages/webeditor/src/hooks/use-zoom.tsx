/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { useLayout } from '@/context/LayoutContext';
import { getCanvasZoomOptions } from '@/utils/get-zoom-level';

import type React from 'react';
import { useCallback, useLayoutEffect } from 'react';

function resetAutoZoom(
  initialWidth: number,
  frameRef: React.RefObject<HTMLElement>,
  zoom?: number,
) {
  if (!frameRef.current) return;
  const {
    autoZoom,
    rootHeight,
    zoom: zoomValue,
  } = getCanvasZoomOptions(initialWidth, frameRef.current, zoom);

  return {
    zoom: { label: 'Auto', value: Number(zoomValue.toFixed(2)) },
    height: rootHeight,
    autoZoom: autoZoom,
  };
}

export const useZoom = (frameRef: React.RefObject<HTMLElement>) => {
  const { layout } = useLayout();

  useLayoutEffect(() => {
    if (layout.autoZoom) {
      handleResetAutoZoom();
    }
  }, [layout.autoZoom, layout.zoom.label]);

  const handleResetAutoZoom = useCallback(() => {
    const values = resetAutoZoom(
      layout.panelWidth,
      frameRef,
      layout.autoZoom ? undefined : layout.zoom.value,
    );

    if (!values) return;
    const { zoom, height, autoZoom } = values;

    if (zoom.value > autoZoom) {
      layout.update({ zoom: { label: 'Auto', value: autoZoom }, height });
      return;
    }

    layout.update({ zoom: { label: 'Auto', value: zoom.value }, height });
  }, [layout.panelWidth, frameRef, layout.update]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      handleResetAutoZoom();
    });

    if (frameRef.current) {
      observer.observe(frameRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [frameRef, handleResetAutoZoom]);

  return {
    zoom: layout.zoom,
    height: layout.height,
    resetAutoZoom: handleResetAutoZoom,
  };
};
