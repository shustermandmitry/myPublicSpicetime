import Theme from '@/components/ThemeEditor/LightThemeEditor';
import { useEditorStore } from '@/context/EditorContext';
import { TabsProps } from '@/store/editor';
import styled from '@emotion/styled';
import { HeaderEditPanel } from '@treenity/admin-components/widgets';
import { RENDER_CONTEXT, RenderContextProvider } from '@treenity/ui-kit';
import React, { useDeferredValue } from 'react';
import Settings from './Settings';
import Styles from './Styles';

const TabComponents: Record<TabsProps, React.FC> = {
  style: Styles,
  settings: Settings,
  theme: Theme,
};

const tabs = [
  {
    value: 'style',
    label: 'Style',
  },
  {
    value: 'settings',
    label: 'Settings',
  },
  {
    value: 'theme',
    label: 'Theme',
  },
];

const RightSidebar: React.FC = () => {
  const activeTab = useEditorStore(state => state.activeRightTab);
  const setActiveTab = useEditorStore(state => state.setActiveRightTab);
  // We currently have to use useDeferredValue to prevent the lag animation of the header slider, because Styles component is slow to render.
  // This is a temporary solution until we stop mounting / unmounting the Active Tab Component.
  const differedActiveTab = useDeferredValue(activeTab);

  const ActiveComponent = TabComponents[differedActiveTab];

  return (
    <Root className="sidebar">
      <RenderContextProvider value={RENDER_CONTEXT.WIDGET}>
        <HeaderEditPanel value={activeTab} onChangeTab={setActiveTab} tabs={tabs} />
        <ActiveComponent />
        {/*{activeTab !== differedActiveTab ? <div></div> : <ActiveComponent />}*/}
      </RenderContextProvider>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colorBgPanel};
  width: 280px;
  padding-bottom: 12px;
  gap: 12px;
`;

export default React.memo(RightSidebar);
