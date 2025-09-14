import { useEditorStore } from '@/context/EditorContext';
import { useLayout } from '@/context/LayoutContext';
import { TabsProps } from '@/store/editor';
import { useEditor } from '@craftjs/core';
import styled from '@emotion/styled';
import { HeaderEditPanel } from '@treenity/admin-components/widgets';
import { RENDER_CONTEXT, RenderContextProvider } from '@treenity/ui-kit';
import React, { useDeferredValue, useEffect, useMemo } from 'react';
import AIGen from './AIGen';
import ElementsLayout from './ElementsLayout';
import Layers from './Layers';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colorBgPanel};
  width: 280px;
  padding-bottom: 12px;
  gap: 12px;
`;

const TabComponents: Record<TabsProps, React.FC> = {
  elements: ElementsLayout,
  layers: Layers,
  ai: AIGen,
};

const tabs = [
  {
    value: 'elements',
    label: 'Elements',
  },
  {
    value: 'layers',
    label: 'Layers',
  },
];

const useActiveNode = () => {
  const { config } = useLayout();
  const { node } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      active: currentlySelectedNodeId,
      node: state.nodes[currentlySelectedNodeId],
    };
  });

  const activeElement = useMemo(() => {
    if (!node || !config) return null;
    const type = node.data.name;
    return config.components[type] || null;
  }, [node, config]);

  return activeElement;
};

const LeftSidebar: React.FC = () => {
  const activeTab = useEditorStore(state => state.activeLeftTab);
  const setActiveTab = useEditorStore(state => state.setActiveLeftTab);
  // We currently have to use useDeferredValue to prevent the lag animation of the header slider, because Styles component is slow to render.
  // This is a temporary solution until we stop mounting / unmounting the Active Tab Component.
  const differedActiveTab = useDeferredValue(activeTab);
  const activeElement = useActiveNode();
  const hasAiFeature = activeElement?.fields?.ai;

  const ActiveComponent = TabComponents[differedActiveTab] ?? TabComponents['elements'];

  useEffect(() => {
    if (!hasAiFeature && activeTab === 'ai') {
      setActiveTab('elements');
    }
  }, [activeElement]);

  return (
    <Root className="sidebar">
      <RenderContextProvider value={RENDER_CONTEXT.WIDGET}>
        <HeaderEditPanel
          value={activeTab}
          onChangeTab={setActiveTab}
          tabs={hasAiFeature ? [...tabs, { value: 'ai', label: 'AI Gen.' }] : tabs}
        />

        <ActiveComponent />
        {/*{activeTab !== differedActiveTab ? <div></div> : <ActiveComponent />}*/}
      </RenderContextProvider>
    </Root>
  );
};

export default React.memo(LeftSidebar);
