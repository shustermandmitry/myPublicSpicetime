import { Meta, types } from '@treenity/core';
import { RENDER_CONTEXT } from '@treenity/ui-kit';
import { useNode } from '@craftjs/core';
import { useLayout } from '@/context/LayoutContext';
import { WebEditorConfig } from './generate-editor-config';
import { withNode } from '@/components/blocks/shared/withNode';
import { ComponentSchema } from '@/types/component-schema';
import renderPrefab from './render-schema';

export function registerComplexComponent(componentName: string, schema: ComponentSchema): void {
  if (!componentName || !schema.$type) {
    throw new Error('Component name and $type are required');
  }

  types.react.add(
    RENDER_CONTEXT.EDIT + ':' + componentName,
    // @ts-ignore
    withNode(
      () => {
        const { config } = useLayout();
        return renderPrefab(schema, config);
      },
      {},
      componentName,
    ),
  );
}
