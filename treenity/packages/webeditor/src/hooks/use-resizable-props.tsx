import type { ResizablePanelProps } from '@/components/ResizablePanel';
import { BREAKPOINTS, sizeBreakpointsInPixels } from '@/constants';

import React, { useCallback } from 'react';

export const useResizableProps = () => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const onDragStart: ResizablePanelProps['onDragStart'] = useCallback(() => {
    const iframe = document.querySelector('iframe[data-rfd-iframe=true]') as HTMLIFrameElement;

    if (iframe) {
      iframe.style.pointerEvents = 'none';
      iframe.style.userSelect = 'none';
    }

    return rootRef?.current && (rootRef.current.style.filter = `blur(2px)`);
  }, []);

  const onDragEnd: ResizablePanelProps['onDragEnd'] = useCallback(() => {
    const iframe = document.querySelector('iframe[data-rfd-iframe=true]') as HTMLIFrameElement;

    if (iframe) {
      iframe.style.pointerEvents = 'all';
      iframe.style.userSelect = 'all';
    }

    if (rootRef?.current) {
      rootRef.current.removeAttribute('style');
    }
  }, []);

  return {
    rootRef,
    onDragStart,
    onDragEnd,
    initialWidth: BREAKPOINTS['xxl'],
    maxWidth: 1920,
    minWidth: sizeBreakpointsInPixels['sm'],
  };
};
