/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { Canvas } from '@/components/Canvas';
import { WebEditorEntity } from '@/components/Editor/webeditor.entity';
import LeftSidebar from '@/components/Siders/LeftSidebar';
import RightSidebar from '@/components/Siders/RightSidebar';
import styled from '@emotion/styled';
import { type FC, type PropsWithChildren } from 'react';

export interface WebEditorLayoutProps {
  onPublish?: (data: WebEditorEntity['layout']) => void;
  showSidebar?: boolean;
}

export const Layout: FC<PropsWithChildren<WebEditorLayoutProps>> = ({
  children,
  onPublish,
  showSidebar = true,
}) => {
  return (
    <Root>
      {showSidebar && <LeftSidebar />}
      <Canvas onPublish={onPublish}>{children}</Canvas>
      {showSidebar && <RightSidebar />}
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
  height: calc(100vh - 64px - 60px);
  display: grid;
  grid-template-columns: min-content 2fr min-content;

  .sidebar {
    overflow-y: scroll;
    scrollbar-width: none;
  }
`;
