import { WebEditorCanvasLayout } from '@/components/Canvas/Canvas.styles';
import { WebEditorEntity } from '@/components/Editor/webeditor.entity';
import ResizablePanel from '@/components/ResizablePanel/ResizablePanel';
import { useLayout } from '@/context/LayoutContext';
import { useResizableProps } from '@/hooks/use-resizable-props';
import { useZoom } from '@/hooks/use-zoom';

import { observer } from 'mobx-react-lite';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useRef } from 'react';

export interface EditorCanvasProps {
  onPublish?: (data: WebEditorEntity['layout']) => void;
}

export const Canvas: FC<PropsWithChildren<EditorCanvasProps>> = observer(({ children }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const { layout } = useLayout();
  const { zoom, height } = useZoom(frameRef);
  const resizableProps = useResizableProps();

  const onSizeChange = useCallback(
    (size: number) => {
      layout.update({ panelWidth: size });
    },
    [layout],
  );

  return (
    <WebEditorCanvasLayout ref={frameRef} id="webeditor-canvas">
      <ResizablePanel
        onSizeChange={onSizeChange}
        width={layout.panelWidth}
        zoom={zoom.value}
        height={height}
        {...resizableProps}
      >
        {children}
      </ResizablePanel>
    </WebEditorCanvasLayout>
  );
});
