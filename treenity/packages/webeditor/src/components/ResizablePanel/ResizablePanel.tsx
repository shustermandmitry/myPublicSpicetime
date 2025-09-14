/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Container, CustomHandle, DragOverlay, Panel } from '@/components/ResizablePanel/ResizablePanel.styles';
import type { ScreenSize } from '@/constants';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import type { MoveValues, ResizableProps } from 'react-use-resizable';
import { useResizable } from 'react-use-resizable';
import { useDebouncedCallback } from 'use-debounce';

export interface ResizablePanelProps {
  width: number;
  onSizeChange: (width: number) => void;
  initialWidth: string;
  zoom: number;
  height: number;
  style?: CSSProperties;
  maxWidth?: number;
  minWidth?: number;
  initialValue?: ScreenSize;
  onDragStart?: ResizableProps['onDragStart'];
  onDragEnd?: ResizableProps['onDragStart'];
  rootRef?: React.RefObject<HTMLDivElement>;
}

const ResizablePanel = ({
  children,
  onSizeChange,
  onDragStart,
  initialWidth,
  minWidth,
  style,
  maxWidth,
  onDragEnd,
  width,
  zoom,
  height,
}: PropsWithChildren<ResizablePanelProps>) => {
  const [isDragging, setIsDragging] = useState(false);

  const debouncedOnResize = useDebouncedCallback(onSizeChange, 150, {
    leading: true,
    maxWait: 300,
  });

  const { getRootProps, getHandleProps } = useResizable({
    initialWidth,
    initialHeight: '100%',
    maxWidth,
    minWidth,
    onResize: useCallback(
      (values: MoveValues) => debouncedOnResize(values.newWidth),
      [debouncedOnResize],
    ),
    lockVertical: true,
    onDragStart: useCallback(
      (values: MoveValues) => {
        setIsDragging(true);
        onDragStart?.(values);
      },
      [onDragStart],
    ),
    onDragEnd: useCallback(
      (values: MoveValues) => {
        setIsDragging(false);
        onDragEnd?.(values);
      },
      [onDragEnd],
    ),
  });

  const containerStyles = useMemo(
    () =>
      ({
        userSelect: isDragging ? 'none' : 'all',
        transition: !isDragging ? 'all 0.1s linear' : 'none',
        transform: `scale(${zoom - 0.02})`,
        transformOrigin: 'center top',
        height: height === 0 ? 'auto' : `${height * 0.95}px`,
        width: `${width}px`,
        ...style,
      }) as React.CSSProperties,
    [style, height, zoom, isDragging, width],
  );

  return (
    <Panel>
      <Container id="resize-container" {...getRootProps()} width={width} style={containerStyles}>
        <CustomHandle
          position="right"
          {...getHandleProps({
            reverse: true,
          })}
        />
        {children}
        <CustomHandle {...getHandleProps()} />
        {isDragging && <DragOverlay />}
      </Container>
    </Panel>
  );
};

export default ResizablePanel;
