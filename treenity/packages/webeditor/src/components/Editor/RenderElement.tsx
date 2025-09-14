import ActionBar from '@/components/ActionBar';
import ToolbarItem from '@/components/ToolbarItem';
import { useLayout } from '@/context/LayoutContext';
import useSWRMetaCache from '@/hooks/use-swr-meta-cache';
import useWebEditor from '@/hooks/use-web-editor';

import type { ComponentSchema } from '@/types/component-schema';
import { useEditor, useNode } from '@craftjs/core';
import { useTheme } from '@emotion/react';
import { debounce } from '@s-libs/micro-dash';
import { Icon } from '@treenity/admin-components/components';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const OFFSET = 4;

const filterMetaProperties = (meta: Record<string, any>) => {
  if (!meta) return meta;

  return Object.entries(meta).reduce(
    (acc, [key, value]) => {
      // Keep if it's exactly '$' or doesn't start with '$' followed by a letter
      if (key === '$' || !/^\$[a-zA-Z]/.test(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};

function RenderElement({ render }: { render: React.ReactNode }) {
  const { id } = useNode();
  const theme = useTheme();

  const { query, isActive, isDragging } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
    isDragging: query.getEvent('dragged').contains(id),
  }));

  const { node, layout } = useLayout();
  const getMetaFromCache = useSWRMetaCache(node);
  const { removeNodeTree, cloneComponent } = useWebEditor(node);

  const {
    isHover,
    dom,
    name,
    deletable,
    copyable,
    ancestors,
    dragged,
    connectors: { drag },
    isRoot,
  } = useNode(node => {
    return {
      ancestors: query
        .node(node.id)
        .ancestors()
        .map(node => ({ id: node, type: query.node(node).get().data.name }))
        .filter(node => node.type !== 'root'),
      node: node,
      isHover: node.events.hovered,
      selected: query.getEvent('selected').first(),
      dom: node.dom,
      isRoot: query.node(node.id).isRoot(),
      name: node.data.name || node.data.displayName,
      copyable: !query.node(node.id).isRoot(),
      deletable: query.node(node.id).isDeletable(),
      dragged: node.events.dragged,
      props: node.data.props,
    };
  });

  useEffect(() => {
    if (dom && id !== 'ROOT') {
      if (isActive || isHover) {
        dom.classList.add('component-selected');
      } else {
        dom.classList.remove('component-selected');
      }

      if (isDragging) {
        dom.classList.add('component-drag');
      } else {
        dom.classList.remove('component-drag');
      }
    }
  }, [dom, isActive, isHover, isDragging]);

  const [position, setPosition] = useState({ top: '-100vh', left: '-100vw' });

  const getPos = useCallback((dom: HTMLElement) => {
    const domRect = dom.getBoundingClientRect();
    const iframeRect = (
      document.querySelector('iframe#canvas-iframe') as HTMLIFrameElement
    )?.getBoundingClientRect();
    const panelRect = (
      document.querySelector('div#action-bar-panel') as HTMLDivElement
    )?.getBoundingClientRect();
    const canvasRect = (
      document.querySelector('div#webeditor-canvas') as HTMLDivElement
    )?.getBoundingClientRect();

    if (!domRect || !iframeRect) return { top: '0px', left: '0px', origin: 'top left' };

    const top = domRect.top + (window.scrollY || 0);
    const left = domRect.left + (window.scrollX || 0);
    const isFirstElement = top <= 0;

    const leftIndent = (canvasRect?.width - iframeRect?.width) / 2;

    const endOfPanel = domRect.left + panelRect?.width;
    const mostRightPosition = canvasRect?.width - panelRect?.width - leftIndent;

    return {
      top: `${!isFirstElement ? top - 32 - OFFSET : domRect.bottom + 24 + OFFSET}px`,
      left:
        leftIndent + endOfPanel > canvasRect.width
          ? `${mostRightPosition}px`
          : `${left + OFFSET}px`,
    };
  }, []);

  useLayoutEffect(() => {
    if (!dom) return;

    if (!isActive) {
      setPosition({ top: '-100vh', left: '-100vw' });
      return;
    }

    const updatePosition = debounce(() => {
      const newPos = getPos(dom);
      window.requestAnimationFrame(() => {
        setPosition(newPos);
      });
    }, 5);

    const iframe = document.querySelector('iframe#canvas-iframe') as HTMLIFrameElement;

    updatePosition();

    if (iframe?.contentWindow) {
      iframe.contentWindow.addEventListener('scroll', updatePosition, { passive: true });
      iframe.contentWindow.addEventListener('resize', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });

      return () => {
        updatePosition.cancel();
        iframe.contentWindow?.removeEventListener('scroll', updatePosition);
        iframe.contentWindow?.removeEventListener('resize', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [dom, getPos, isActive]);

  useEffect(() => {
    if (!isActive || !dom) return;
    const newPos = getPos(dom);
    window.requestAnimationFrame(() => {
      setPosition(newPos);
    });
  }, [dragged]);

  const container =
    typeof document !== 'undefined' &&
    ((
      document?.querySelector('iframe#canvas-iframe') as HTMLIFrameElement
    )?.contentDocument?.querySelector('.page-container') ||
      document?.querySelector('.page-container'));

  return (
    <>
      {isActive && !isRoot
        ? createPortal(
            <>
              <ActionBar
                ancestors={ancestors}
                label={name}
                className="action-bar-styled"
                style={{
                  position: 'fixed',
                  translate: `${position.left} ${position.top}`,
                  zIndex: 9999,
                }}
              >
                <div className={deletable || copyable ? 'delete-section' : ''}>
                  {deletable ? (
                    <ToolbarItem
                      tooltip="Delete element"
                      onClick={async () => {
                        removeNodeTree(id);
                      }}
                    >
                      <Icon name="trash_outlined" color={theme.colorError} />
                    </ToolbarItem>
                  ) : null}
                  <ToolbarItem
                    tooltip="Add to favorites"
                    interactive
                    onClick={() => {
                      const presetName = prompt('Enter a name for the component');
                      if (!presetName) return;

                      function schemaFromNode(id: string): ComponentSchema {
                        const nodeToAdd = query.node(id).toSerializedNode();
                        const meta = filterMetaProperties(getMetaFromCache(id)?.data.toJSON());

                        return {
                          $type:
                            typeof nodeToAdd.type === 'string'
                              ? nodeToAdd.type
                              : nodeToAdd.type?.resolvedName,
                          children: nodeToAdd.nodes.map(node => schemaFromNode(node)),
                          ...meta,
                        };
                      }

                      const schema = schemaFromNode(id);

                      layout.addPrefab(presetName, schema);
                    }}
                  >
                    <Icon name="favourite_outlined" />
                  </ToolbarItem>
                  {copyable && (
                    <ToolbarItem
                      tooltip="Copy element"
                      interactive
                      onClick={async () => {
                        cloneComponent(id);
                      }}
                    >
                      <Icon name="duplicate_outlined" />
                    </ToolbarItem>
                  )}
                </div>
              </ActionBar>
            </>,
            container as Element,
          )
        : null}
      {render}
    </>
  );
}

export default RenderElement;
