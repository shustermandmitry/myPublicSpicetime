import { WIDGETS_MAP, WidgetWrapper } from '@/components/fields';
import addReactWidget from '@/components/fields/shared/add-react-widget';
import { ArrayField, Field, ObjectField } from '@/types/fields';
import { metaType, types } from '@treenity/core';
import { JsonObjectSchema } from '@treenity/json-schema';
import { Render, RENDER_CONTEXT } from '@treenity/ui-kit';
import { ReactNode } from 'react';

const createCustomWidgetField = (
  key: keyof typeof WIDGETS_MAP,
  schema?: JsonObjectSchema,
): Field => ({
  type: 'custom',
  label: schema?.title || key,
  render: createRenderFunction(WIDGETS_MAP[key], { default: schema?.default }),
});
const getWidgetForType = (schema: JsonObjectSchema): string => {
  if (schema.widget) {
    return schema.widget;
  }

  return schema.enum
    ? WIDGETS_MAP.SELECT
    : schema.type === 'number'
      ? WIDGETS_MAP.NUMBER
      : schema.type === 'boolean'
        ? WIDGETS_MAP.CHECKBOX
        : WIDGETS_MAP.TEXT;
};
export const createRenderFunction = (
  widgetName: string,
  additionalProps: Record<string, unknown> = {},
) => {
  const type = metaType(widgetName, RENDER_CONTEXT.WIDGET);
  // @ts-ignore
  const isExist = types.react.items.get(type.$id);
  if (!isExist) {
    // @ts-ignore
    const widget = types.react.items.get(type.$type);
    if (widget) {
      addReactWidget(widgetName, WidgetWrapper(widget.component as any));
    }
  }

  return (props: Record<string, unknown>) => (
    <Render {...props} {...additionalProps} url={widgetName} value={'REMOVE_ME_LATER'} />
  );
};
const createSelectField = (key: string, schema: JsonObjectSchema): Field => {
  return {
    type: 'custom',
    label: schema.title || key,
    render: createRenderFunction(WIDGETS_MAP.SELECT, {
      options: schema.enum!.map((option: string | number) => ({
        label: String(option),
        value: option,
      })),
      default: schema.default || schema.enum![0],
    }),
  };
};
const createObjectField = (
  key: string,
  schema: JsonObjectSchema,
  definitions: Record<string, JsonObjectSchema> | undefined,
): ObjectField & { defaultProperties: Record<string, unknown> } => ({
  type: 'object',
  label: schema.title || key,
  defaultProperties: schema.default || {},
  objectFields: parseSchemaProperties(schema.properties || {}, definitions),
});
const createArrayField = (
  key: string,
  schema: JsonObjectSchema,
  definitions: Record<string, JsonObjectSchema> | undefined,
): ArrayField & { render: (props: Record<string, unknown>) => ReactNode } => {
  const properties = schema.items ? parseSchemaProperties({ item: schema.items }, definitions) : {};

  return {
    type: 'array',
    label: schema.title || key,
    arrayFields: properties,
    // @ts-ignore
    defaultItemProps: schema.default || properties.item?.defaultProperties || '',
    render: createRenderFunction(WIDGETS_MAP.ARRAY, { widget: schema.widget }),
  };
};
const createBasicField = (key: string, schema: JsonObjectSchema): Field => ({
  type: 'custom',
  label: schema.title || key,
  render: createRenderFunction(getWidgetForType(schema), { default: schema.default }),
});
const resolveRef = (
  schema: JsonObjectSchema,
  definitions: Record<string, JsonObjectSchema>,
): JsonObjectSchema => {
  if (schema.$ref) {
    const refPath = schema.$ref.split('/');
    const refKey = refPath[refPath.length - 1];
    return definitions[refKey] || schema;
  }
  return schema;
};
const isSelectField = (field: JsonObjectSchema) => {
  return 'enum' in field;
};
export const createField = (
  key: string,
  schema: JsonObjectSchema,
  definitions: Record<string, JsonObjectSchema> | undefined,
): Field => {
  const resolvedSchema = resolveRef(schema, definitions || {});

  if (isSelectField(resolvedSchema)) {
    return createSelectField(key, resolvedSchema);
  }

  switch (resolvedSchema.type) {
    case 'object':
      return createObjectField(key, resolvedSchema, definitions);
    case 'array':
      return createArrayField(key, resolvedSchema, definitions);
    default:
      return createBasicField(key, resolvedSchema);
  }
};
const filterPrivateFields = ([key, _]: [key: string, value: any]) => {
  return !key.startsWith('$') && !key.startsWith('#');
};
export const parseSchemaProperties = (
  properties: Record<string, JsonObjectSchema>,
  definitions: Record<string, JsonObjectSchema> | undefined,
): Record<string, Field> =>
  Object.entries(properties)
    .filter(filterPrivateFields)
    .reduce(
      (acc, [key, schema]) => {
        acc[key] =
          key === 'styles'
            ? parseStyleSchema(schema, definitions || {})
            : createField(key, schema, definitions);
        return acc;
      },
      {} as Record<string, Field>,
    );

export function parseStyleSchema(
  schema: JsonObjectSchema,
  definitions: Record<string, JsonObjectSchema>,
): Field {
  const resolvedStyleSchema = resolveRef(schema, definitions);
  const styleFields: Record<string, Field> = {};

  for (const key in resolvedStyleSchema.properties) {
    styleFields[key] = createCustomWidgetField(key.toUpperCase() as keyof typeof WIDGETS_MAP);
  }

  return {
    type: 'object',
    label: 'Styles',
    objectFields: styleFields,
  };
}
