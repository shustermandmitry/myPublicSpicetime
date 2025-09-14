import { useEditorStore } from '@/context/EditorContext';
import { useLayout } from '@/context/LayoutContext';
import useCurrentScreenSize from '@/hooks/use-current-screen-size';
import useSWRMetaCache from '@/hooks/use-swr-meta-cache';
import useWebEditor from '@/hooks/use-web-editor';
import { getEntityOverrides } from '@/utils/entity-props';
import { mergeNestedProps } from '@/utils/merge-responsive-props';
import { constructTree } from '@/utils/tree';
import { useEditor } from '@craftjs/core';
import { Layers } from '@treenity/admin-components/widgets';
import { Entity } from '@treenity/entity';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ComponentProps, useMemo } from 'react';

function LayersTree() {
  const { layout, node } = useLayout();
  const setActiveTab = useEditorStore(s => s.setActiveLeftTab);
  const screen = useCurrentScreenSize();
  const getEntityFromCache = useSWRMetaCache(node);

  const treeData = useMemo(
    () =>
      constructTree(toJS(layout?.layout), id => {
        const entity = getEntityFromCache(id)?.data as Entity<any>;

        if (!entity) return { isHidden: false };

        const overrides = getEntityOverrides(entity);

        // @ts-ignore
        const mergedOverrides = mergeNestedProps({}, overrides, screen);

        return {
          isHidden: mergedOverrides?.hidden,
        };
      }),
    [layout?.layout, screen],
  );

  const handleDoubleClick: ComponentProps<typeof Layers>['onDoubleClick'] = () => {
    setActiveTab('style');
  };

  const { actions, itemId } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent('selected').first();
    return {
      itemId: currentlySelectedNodeId,
    };
  });

  const { removeNodeTree, cloneComponent } = useWebEditor(node);

  const handleSelect: ComponentProps<typeof Layers>['onSelect'] = (selectedKeys, info) => {
    if (!info.selectedNodes.length) {
      return;
    }

    const node = info.selectedNodes[0];
    actions.selectNode(node.key as string);
  };

  return (
    <Layers
      data={treeData}
      onSelect={handleSelect}
      onDoubleClick={handleDoubleClick}
      selectedKeys={itemId ? [itemId] : []}
      onRemove={removeNodeTree}
      onDuplicate={cloneComponent}
      onHide={(key, isHidden) => {
        const entity = getEntityFromCache(key)?.data as Entity<any>;

        if (!entity) {
          console.error(`Entity not found for key ${key}`);
          return;
        }

        entity?.$.addVariantOverride(screen, { hidden: !isHidden });
        actions.setHidden(key, !isHidden);
      }}
    />
  );
}

export default observer(LayersTree);
