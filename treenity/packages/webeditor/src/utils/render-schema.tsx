import type { ComponentSchema } from '@/types/component-schema';
import { WebEditorConfig } from '@/utils/generate-editor-config';
import { ReactNode } from 'react';
import { Element } from '@craftjs/core';

function isCanvasComponent(
  children: ComponentSchema['children'],
): children is ComponentSchema | ComponentSchema[] {
  return Array.isArray(children) || (typeof children === 'object' && '$type' in children);
}

export default function renderPrefab(
  schemaNode: ComponentSchema,
  config?: WebEditorConfig,
  id?: string,
): ReactNode {
  if (!config) return <div>No config</div>;

  const Component = config.components[schemaNode.$type]?.render;
  if (!Component) return <div>Component {schemaNode.$type} not found</div>;

  const { $type, children, ...props } = schemaNode;

  if (isCanvasComponent(schemaNode.children)) {
    return (
      <Element
        is={Component}
        canvas={isCanvasComponent(schemaNode.children)}
        initialState={{ ...props }}
        id={id}
      >
        {Array.isArray(schemaNode.children)
          ? schemaNode.children.map((child, index) => renderPrefab(child, config))
          : renderPrefab(schemaNode.children, config)}
      </Element>
    );
  }

  return <Component initialState={{ ...props }} />;
}
