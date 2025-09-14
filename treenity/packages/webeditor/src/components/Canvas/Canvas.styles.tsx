import styled from '@emotion/styled';
import { Tabs as AntdTabs } from 'antd';

export const WebEditorTabs = styled(AntdTabs)`
  overflow: scroll;
  padding: 0.5rem;
  height: 100dvh;
  width: 100vw;
  background: white;
  border-left: 1px solid #02061710;

  .ant-tabs-content-holder {
    overflow-y: scroll;
    padding-bottom: 3rem;
    scrollbar-width: none;
  }
`;

export const WebEditorCanvasLayout = styled.div`
  position: relative;
  height: 100%;
`;
