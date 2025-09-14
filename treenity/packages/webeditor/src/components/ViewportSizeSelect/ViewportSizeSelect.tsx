/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { SizesPanelWrapper } from '@/components/ResizablePanel/ResizablePanel.styles';
import ViewportSizes from '@/components/ViewportSizeSelect/ViewportSizes';
import { ScreenSize, sizeBreakpointsInPixels } from '@/constants';
import { useLayout } from '@/context/LayoutContext';
import useCurrentScreenSize from '@/hooks/use-current-screen-size';

import { observer } from 'mobx-react-lite';
import type { FC } from 'react';

const ViewportSizeSelect: FC = observer(() => {
  const { layout } = useLayout();
  const screenSize = useCurrentScreenSize();

  const onChangeSize = (size: ScreenSize) => {
    layout.update({ panelWidth: sizeBreakpointsInPixels[size] });
  };

  return (
    <SizesPanelWrapper>
      <ViewportSizes value={screenSize} onChangeSize={onChangeSize} />
    </SizesPanelWrapper>
  );
});

export default ViewportSizeSelect;
