import { useEditorStore } from '@/context/EditorContext';
import { TabsProps } from '@/store/editor';
import styled from '@emotion/styled';
import { HeaderEditPanel } from '@treenity/admin-components/widgets';
import { RENDER_CONTEXT, RenderContextProvider } from '@treenity/ui-kit';
import React, { useDeferredValue } from 'react';
import RenderElementsTab from './RenderElementsTab';
import { IGroutProps } from './types';

const groups: Record<TabsProps, Record<string, IGroutProps>> = {
  elements: {
    basic: {
      title: 'Basic Elements',
      icon: 'par_outlined',
      index: 1,
    },
    markup: {
      title: 'Markup elements',
      icon: 'add-table_outlined',
      index: 2,
    },
    advanced: {
      title: 'Advanced elements',
      icon: 'lightinhg_outlined',
      index: 3,
    },
    form: {
      title: 'Form elements',
      icon: 'input_outlined',
      index: 4,
    },
  },
  layouts: {
    layout: {
      title: 'Layout components',
      icon: 'add-table_outlined',
      index: 5,
    },
    'form-components': {
      title: 'Form components',
      icon: 'input_outlined',
      index: 6,
    },
  },
  templates: {},
  favourite: {},
};

const TabElementsComponents: Record<TabsProps, React.FC> = {
  elements: () => <RenderElementsTab groups={groups.elements} />,
  layouts: () => <RenderElementsTab groups={groups.layouts} />,
  templates: () => <RenderElementsTab groups={groups.templates} />,
  favourite: () => <RenderElementsTab groups={groups.favourite} />,
};

const elementsTabs = [
  {
    value: 'elements',
    label: 'Elements',
  },
  {
    value: 'layouts',
    label: 'Layouts',
  },
  {
    value: 'templates',
    label: 'Templates',
  },
  {
    value: 'favourite',
    label: 'Favourite',
  },
];

const ElementsLayout: React.FC = () => {
  const activeLeftElementsTab = useEditorStore(state => state.activeLeftElementsTab);
  const setActiveElementsTab = useEditorStore(state => state.setActiveLeftElementsTab);
  // We currently have to use useDeferredValue to prevent the lag animation of the header slider, because Styles component is slow to render.
  // This is a temporary solution until we stop mounting / unmounting the Active Tab Component.
  const differedElementsActiveTab = useDeferredValue(activeLeftElementsTab);

  const ActiveComponent = TabElementsComponents[differedElementsActiveTab];

  return (
    <Root className="sidebar">
      <RenderContextProvider value={RENDER_CONTEXT.WIDGET}>
        <HeaderEditPanel
          value={activeLeftElementsTab}
          onChangeTab={setActiveElementsTab}
          tabs={elementsTabs}
        />
        <ActiveComponent />
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

export default React.memo(ElementsLayout);
