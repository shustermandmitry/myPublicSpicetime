import RenderElement from '@/components/Editor/RenderElement';
import { PageEditorContextProvider } from '@/context/EditorContext';
import { IRedirectOptions, LayoutProvider } from '@/context/LayoutContext';
import { useEntityInitialization } from '@/hooks/use-entity-initialization';
import generateEditorConfig, { type WebEditorConfig } from '@/utils/generate-editor-config';
import {
  Editor as CraftEditor,
  Frame as CraftFrame,
  SerializedNodes,
  UserComponent,
} from '@craftjs/core';

import { RENDER_CONTEXT, RenderContextProvider, type TFC } from '@treenity/ui-kit';

import { observer } from 'mobx-react-lite';
import {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  Suspense,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import useSWRImmutable from 'swr/immutable';
import { useDebouncedCallback } from 'use-debounce';
import { NodeCardTitle } from '../blocks/Card/card';
import { NodeHeroContent } from '../blocks/Hero/test-hero';
import { Layout } from '../Layout';
import { ReactIframe } from '../ReactIframe';
import { NodeRootContainer } from './RootContainer';
import { type WebEditorEntity } from './webeditor.entity';
import EditorThemeProvider, {
  CssVariables,
  EditorThemeContext,
} from '../ThemeEditor/EditorThemeProvider';

import EditorEventHandler from './EditorEventHandler';

const fetcher = async () =>
  await generateEditorConfig().catch(err => {
    console.error(err);
    throw err;
  });

// TODO: Replace
const Loader = (props: HTMLAttributes<HTMLDivElement>) => <div {...props}>Loading Editor...</div>;

export type EditorFC<T> = UserComponent<PropsWithChildren<T>>;

type Mode = 'edit' | 'preview' | 'render';

const validateState = (state: SerializedNodes) => {
  if ('ROOT' in state) return true;
  return false;
};

const Editor: TFC<
  WebEditorEntity,
  {
    layout: WebEditorEntity;
    onSave?: (data: WebEditorEntity['layout']) => void;
    edit?: Mode;
    redirectOptions?: IRedirectOptions;
    suspense?: boolean;
  }
> = observer(({ value, node, onSave, edit = 'edit', suspense = false, redirectOptions }) => {
  const { data: config } = useSWRImmutable<WebEditorConfig>([node.url, 'layout.config'], fetcher, {
    suspense,
  });

  const isInitialized = useEntityInitialization(node);

  const components = Object.entries(config?.components || {}).reduce(
    (acc, [key, value]) => {
      acc[key] = value.render;
      return acc;
    },
    {} as Record<string, React.ComponentType>,
  );

  const resolver = {
    ...components,
    CardTitle: NodeCardTitle,
    HeroContent: NodeHeroContent,
    root: NodeRootContainer,
  };

  // const resolver = useMemo(
  //   () =>
  //     new Proxy(
  //       {
  //         ...components,
  //         CardTitle: NodeCardTitle,
  //         HeroRoot: NodeHeroRoot,
  //         HeroTitle: NodeHeroTitle,
  //         HeroContent: NodeHeroContent,
  //         root: NodeRoot,
  //       },
  //       {
  //         get: (target, prop, receiver) => {
  //           // if (prop in components) {
  //           // }
  //           // console.log('Accessing component:', String(prop));
  //           // if (prop in components) {
  //           //   return (props: Record<string, unknown>) => {
  //           //     return <WebEditorComponent {...props} typeId={String(prop)} />;
  //           //   };
  //           // }
  //           // if (typeof prop === 'symbol') {
  //           //   return Reflect.get(target, prop, receiver);
  //           // }
  //           console.log({ target, prop, receiver });

  //           // if (typeof prop === 'string' && config && !(prop in target)) {
  //           //   return config.components?.[prop]?.render;
  //           // }

  //           return Reflect.get(target, prop, receiver);

  //           // console.log({ target, prop, receiver });
  //           // return res;
  //         },
  //         // has: (target, prop) => {
  //         //   return prop in target || prop in config?.components;
  //         // },
  //         // ownKeys: target => {
  //         //   const targetKeys = Reflect.ownKeys(target);
  //         //   const componentKeys = config?.components ? Object.keys(config.components) : [];
  //         //   return [...targetKeys, ...componentKeys];
  //         // },
  //         // getOwnPropertyDescriptor: (target, prop) => {
  //         //   const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
  //         //   if (descriptor) return descriptor;

  //         //   if (config?.components && prop in config.components) {
  //         //     return {
  //         //       enumerable: true,
  //         //       configurable: true,
  //         //       value: config.components[String(prop)].render,
  //         //     };
  //         //   }
  //         // },
  //       },
  //     ),
  //   [config],
  // );

  const onNodesChange: React.ComponentProps<typeof CraftEditor>['onNodesChange'] = query => {
    const nodes = query.getSerializedNodes();
    if (validateState(nodes)) {
      value.updateLayout(nodes);
      onSave?.(nodes);
    } else {
      console.warn('Editor is trying to save invalid state', nodes);
    }
  };

  if (!suspense && (!config || !isInitialized)) return <Loader />;

  const isEditMode = edit === 'edit';
  const View = VIEWS[edit];

  return (
    <RenderContextProvider value={isEditMode ? RENDER_CONTEXT.EDIT : RENDER_CONTEXT.RENDER}>
      <PageEditorContextProvider>
        <Suspense fallback={<Loader />}>
          <LayoutProvider value={{ config, node, layout: value, suspense, redirectOptions }}>
            <EditorThemeProvider node={node} value={{}} onChange={null!}>
              <CraftEditor
                resolver={resolver}
                enabled={isEditMode}
                indicator={{
                  style: { display: 'none' },
                }}
                handlers={store =>
                  new EditorEventHandler(
                    {
                      store,
                      isMultiSelectEnabled: () => false,
                      removeHoverOnMouseleave: true,
                    },
                    node,
                  )
                }
                key={node.path || node.url + '-' + edit}
                onNodesChange={onNodesChange}
                {
                  /* if on render specified and undefined it crashes*/
                  ...(isEditMode ? { onRender: RenderElement } : undefined)
                }
              >
                <View layout={value} />
              </CraftEditor>
            </EditorThemeProvider>
          </LayoutProvider>
        </Suspense>
      </PageEditorContextProvider>
    </RenderContextProvider>
  );
});

const EditView = ({ layout }: { layout: WebEditorEntity }) => {
  const { seedVars } = useContext(EditorThemeContext);

  return (
    <Layout>
      <div className="page-container"></div>
      <ReactIframe
        title="test"
        blockLinks={true}
        style={{ width: '100%', height: '100%', border: 'none', userSelect: 'none' }}
      >
        <CssVariables id="css-variables" vars={seedVars}>
          <CraftFrame data={JSON.parse(JSON.stringify(layout.layout))}></CraftFrame>
        </CssVariables>
      </ReactIframe>
    </Layout>
  );
};

const PreviewView = ({ layout }: { layout: WebEditorEntity }) => {
  return (
    <Layout showSidebar={false}>
      <div className="page-container"></div>
      <ReactIframe title="test" style={{ width: '100%', height: '100%', border: 'none' }}>
        <CraftFrame data={JSON.parse(JSON.stringify(layout.layout))}></CraftFrame>
      </ReactIframe>
    </Layout>
  );
};

const RenderView: FC<{ layout: WebEditorEntity }> = ({ layout }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedResize = useDebouncedCallback(
    (width: number) => layout.update({ panelWidth: width }),
    100,
  );

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        debouncedResize(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <CraftFrame data={JSON.parse(JSON.stringify(layout.layout))}></CraftFrame>
    </div>
  );
};

const VIEWS = {
  edit: EditView,
  preview: PreviewView,
  render: RenderView,
} satisfies Record<Mode, FC<any>>;

export default Editor;
