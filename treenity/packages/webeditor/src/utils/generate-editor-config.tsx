/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Copyright (c) 2024. Treenity Inc.
 */

import WebEditorCell from '@/components/blocks/shared/Wrapper';
import { WIDGETS_MAP } from '@/components/fields';
import { TYPES_TO_IGNORE } from '@/constants';
import { RenderItemFunction } from '@/types';
import { Field } from '@/types/fields';
import { createRenderFunction, parseSchemaProperties } from '@/utils/parse-style-schema';
import { types } from '@treenity/core';
import { JsonObjectSchema, SchemaContextInfo } from '@treenity/json-schema';
import { RENDER_CONTEXT, type RenderContextType } from '@treenity/ui-kit';
import { ReactNode } from 'react';

const sharedProps: Record<string, Field> = {
  hidden: {
    type: 'custom',
    label: 'Visible',
    render: createRenderFunction(WIDGETS_MAP.CHECKBOX),
  },
  id: {
    type: 'custom',
    label: 'ID',
    render: createRenderFunction(WIDGETS_MAP.TEXT),
  },
};

export const generateComponentConfig = (
  typeId: string,
  schemaInfo: SchemaContextInfo,
): EditorComponent => {
  const schema = schemaInfo.component;
  const parsedSchema = schemaInfo
    ? parseSchemaProperties(
        (schema.properties || {}) as Record<string, JsonObjectSchema>,
        (schema.definitions || {}) as Record<string, JsonObjectSchema>,
      )
    : {};

  return {
    fields: {
      ...sharedProps,
      ...parsedSchema,
    },
    schema,
    dynamic: (schemaInfo as any).dynamic,
    label: typeId,
    render: props => {
      // @ts-ignore
      return <WebEditorCell {...props} typeId={typeId} />;
    },
  };
};

type EditorComponent = {
  fields: Record<string, Field>;
  schema: any;
  dynamic: any;
  render: (props: {
    typeId?: string;
    id?: string;
    renderItem?: RenderItemFunction;
    [key: string]: unknown;
  }) => ReactNode;
  label?: string;
  initialProps?: Record<string, any>;
};

export type WebEditorConfig = {
  components: Record<string, EditorComponent>;
};

const extractComponentNameFromId = (id: string) => id.split(':').at(-1);

const getSchema = async (name: string) => {
  return await types.schema.getInfo(name).catch(err => {
    console.error(err);
    return undefined;
  });
};

/**
 * Generates the configuration for the editor.
 *
 * @param renderContext - The render context to generate the configuration for.
 * @returns The generated configuration object.
 */
async function generateEditorConfig(
  renderContext: RenderContextType = RENDER_CONTEXT.EDIT,
): Promise<WebEditorConfig> {
  const reactTypes = await types.react.search(renderContext, '');
  const components: Record<string, EditorComponent> = {};

  for (const type of reactTypes) {
    const name = extractComponentNameFromId(type.id) || type.id;

    if (TYPES_TO_IGNORE.includes(name) || !type.id.startsWith('edit:')) continue;

    const schema = await getSchema(name);

    if (!schema) {
      console.warn(`Schema ${name} not found, skipping addition to the Editor component list`);
      continue;
    }

    components[name] = generateComponentConfig(name, schema);
  }

  return {
    components,
  };
}

export default generateEditorConfig;
