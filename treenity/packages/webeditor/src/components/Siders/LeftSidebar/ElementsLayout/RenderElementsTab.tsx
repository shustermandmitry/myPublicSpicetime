import { useLayout } from '@/context/LayoutContext';
import useWebEditor from '@/hooks/use-web-editor';
import { ComponentSchema } from '@/types/component-schema';
import { WebEditorConfig } from '@/utils/generate-editor-config';
import renderPrefab from '@/utils/render-schema';
import { Element, useEditor } from '@craftjs/core';
import { EmptyState, IconNamesMap } from '@treenity/admin-components/components';
import { Elements as AdminElements } from '@treenity/admin-components/widgets';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactNode, useMemo } from 'react';
import { IGroutProps } from './types';

// TODO: i guess ideally we want to store that somewhere in the metas, hardcoded for now.
type ComponentDetails =
  | {
      title: string;
      image: string;
    }
  | {
      title: string;
      icon: IconNamesMap;
    };

const COMPONENT_DETAILS_MAP: Record<string, ComponentDetails> = {
  'basic.button': {
    title: 'Button',
    image: '/public/components/button.png',
  },
  'basic.richEditor': {
    title: 'RichText',
    icon: 'align-left_outlined',
  },
  'basic.codeComponent': {
    title: 'Code Component',
    icon: 'align-center_outlined',
  },
  'layout.containerWithCards': {
    title: 'Cards',
    image: '/public/components/cards.jpg',
  },
  'markup.container': {
    title: 'Container',
    icon: 'container_outlined',
  },
  'layout.verticalHeader': {
    title: 'Header',
    image: '/public/components/headers-1.jpg',
  },
  'layout.horizontalHeader': {
    title: 'Header',
    image: '/public/components/headers-2.jpg',
  },
  'advanced.carousel': {
    title: 'Carousel',
    icon: 'carousel_outlined',
  },
  'basic.ui.image': {
    title: 'Image',
    icon: 'image_outlined',
  },
  'basic.ui.video': {
    title: 'Video',
    icon: 'play_outlined',
  },
  'advanced.collapse': {
    title: 'Collapse',
    icon: 'accordion_outlined',
  },
  'form.checkbox': {
    title: 'Checkbox',
    icon: 'check-in-square_outlined',
  },
  'form.radio': {
    title: 'Radio',
    icon: 'radio_outlined',
  },
  'form.input': {
    title: 'Input',
    icon: 'input_outlined',
  },
  'form.switch': {
    title: 'Switch',
    icon: 'add-toggle-list_outlined',
  },
  'form.select': {
    title: 'Select',
    icon: 'select_outlined',
  },
  'layout.header': {
    title: 'Header',
    image: '/public/components/headers.jpg',
  },
  'layout.verticalFooter': {
    title: 'Footer',
    image: '/public/components/footers.jpg',
  },
  'layout.horizontalFooter': {
    title: 'Footer',
    image: '/public/components/footers-1.jpg',
  },
  'layout.defaultHero': {
    title: 'Hero',
    image: '/public/components/hero.jpg',
  },
  'layout.verticalHero': {
    title: 'Hero',
    image: '/public/components/hero-1.jpg',
  },
  'layout.horizontalHero': {
    title: 'Hero',
    image: '/public/components/hero-2.jpg',
  },
  'form-components.horizontalContactForm': {
    title: 'Contact Form',
    image: '/public/components/contact-form-2.jpg',
  },
  'form-components.verticalContactForm': {
    title: 'Contact Form',
    image: '/public/components/contact-form-1.jpg',
  },
};

function groupElementsByPrefix(elements: Record<string, unknown>): Record<string, string[]> {
  return Object.keys(elements).reduce(
    (acc, key) => {
      const [group] = key.split('.');
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(key);
      return acc;
    },
    {} as Record<string, string[]>,
  );
}

const getComponentName = (element: string) => {
  return element.split('.').at(-1) as string;
};

let groupId = 100;
const mapGroupTitle = (groups: Record<string, IGroutProps>, group: string): IGroutProps => {
  return (
    groups[group.toLowerCase()] || {
      title: group.charAt(0).toUpperCase() + group.slice(1) + ' components',
      icon: 'command_outlined',
      index: groupId++,
    }
  );
};

interface ElementGroup {
  title: string;
  icon: IconNamesMap;
  items: (
    | {
        title: string;
        icon: IconNamesMap;
        name: string;
      }
    | {
        title: string;
        image: string;
        name: string;
      }
  )[];
}

function getComponentDetails(name: string): ElementGroup['items'][number] {
  return name in COMPONENT_DETAILS_MAP
    ? {
        ...COMPONENT_DETAILS_MAP[name],
        name: name,
      }
    : {
        title: getComponentName(name),
        icon: 'add-square_outlined',
        name: name,
      };
}

function generateElementsData(
  components: WebEditorConfig['components'],
  groups: Record<string, IGroutProps>,
): ElementGroup[] {
  const groupedElements = groupElementsByPrefix(components || {});
  return Object.entries(groupedElements)
    .map(([group, elements]) => {
      return {
        ...mapGroupTitle(groups, group),
        items: elements.map(element => {
          const componentName = components?.[element]?.label || element;
          return getComponentDetails(componentName);
        }),
      };
    })
    .sort((a, b) => a.index - b.index);
}

const GroupWrapper = ({ children }: { children: ReactNode; groupIndex: number }) => (
  <div>{children}</div>
);

function isPrefab(name: string) {
  return name.includes('custom.');
}

function getPrefabName(name: string) {
  return name.split('.').at(-1) as string;
}

const ItemWrapper = ({
  item,
  children,
}: {
  children: ReactNode;
  item: {
    image?: string;
    title: string;
    name: string;
    icon?: IconNamesMap;
  };
  itemIndex: number;
}) => {
  const {
    actions,
    connectors: { create },
  } = useEditor();
  const { node, layout, config } = useLayout();
  const { addComponentToNode } = useWebEditor(node);

  const componentName = isPrefab(item.name) ? getPrefabName(item.name) : item.name;

  const Render = isPrefab(item.name)
    ? config?.components[layout.prefabs[componentName].$type]?.render
    : config?.components[item.name]?.render;

  return (
    <>
      <div
        ref={ref =>
          ref &&
          create(
            ref,
            // @ts-ignore
            () => {
              if (config && isPrefab(item.name) && layout.prefabs[componentName]) {
                const schema = layout.prefabs[componentName];
                return renderPrefab(toJS(schema), config);
              }

              if (!Render) {
                console.error('Component not found', item.name);
                return <div>Component {item.name} not found</div>;
              }

              return item.name.toLowerCase().includes('container') ? (
                <Element is={Render} canvas />
              ) : (
                <Render />
              );
            },
            {
              onCreate: async node => {
                Object.values(node.nodes).forEach(async node => {
                  const props = {
                    ...(node.data.props.initialState || node.data.props),
                  };
                  await addComponentToNode(node.data.name, node.id, props);
                });

                actions.selectNode(node.rootNodeId);
              },
            },
          )
        }
      >
        {children}
      </div>
    </>
  );
};

function prefabsToComponents(
  prefabs: Record<string, ComponentSchema>,
  components: WebEditorConfig['components'],
) {
  return Object.entries(prefabs).reduce(
    (acc, [key, prefab]) => {
      const { $type, children, ...initialProps } = prefab;
      acc['custom.' + key] = {
        ...components[prefab.$type],
        label: 'custom.' + key,
        initialProps: initialProps,
      };
      return acc;
    },
    {} as Record<string, WebEditorConfig['components'][string]>,
  );
}

const RenderElementsTab: FC<{ groups: Record<string, IGroutProps> }> = ({ groups }) => {
  if (!Object.keys(groups).length) {
    return <EmptyState title="Section is empty" />;
  }

  const { layout, config } = useLayout();
  const elementsData = useMemo(
    () =>
      generateElementsData(
        {
          ...config?.components,
          ...prefabsToComponents(layout.prefabs, config?.components || {}),
        },
        groups,
      ),
    [config?.components, layout.prefabs],
  );

  if (!config) {
    return <div>No Config</div>;
  }

  (globalThis as any).__config = config;

  return (
    <AdminElements data={elementsData} GroupWrapper={GroupWrapper} ItemWrapper={ItemWrapper} />
  );
};

export default observer(RenderElementsTab);
