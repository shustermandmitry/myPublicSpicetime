/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { generateComponentConfig } from '@/utils/generate-editor-config';
import { parseSchemaProperties } from '@/utils/parse-style-schema';

import { JSONSchema7, SchemaContextInfo } from '@treenity/json-schema';

jest.mock('@/components/blocks/shared/Wrapper', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const nestedSchema = {
  type: 'object',
  properties: {
    simpleRef: {
      $ref: '#/definitions/stringProp',
    },
    nestedRef: {
      $ref: '#/definitions/nestedProp',
    },
    arrayRef: {
      type: 'array',
      items: {
        $ref: '#/definitions/stringProp',
      },
    },
  },
  definitions: {
    stringProp: {
      type: 'string',
      title: 'String Property',
    },
    objectProp: {
      type: 'object',
      required: ['anotherObjectProp'],
      properties: {
        innerObjectProp: {
          $ref: '#/definitions/stringProp',
        },
        anotherObjectProp: {
          type: 'object',
          required: ['a', 'b'],
          properties: {
            a: {
              type: 'string',
              title: 'A prop',
            },
            b: {
              type: 'string',
              title: 'A prop',
            },
          },
        },
      },
    },
    nestedProp: {
      type: 'object',
      required: ['objectProp'],
      properties: {
        innerProp: {
          $ref: '#/definitions/stringProp',
        },
        objectProp: {
          $ref: '#/definitions/objectProp',
        },
      },
    },
  },
} as unknown as JSONSchema7;

jest.mock('@/components/fields', () => ({
  WIDGETS_MAP: {
    TEXT: 'text',
    SELECT: 'select',
    NUMBER: 'number',
    CHECKBOX: 'checkbox',
    ARRAY: 'array',
  },
}));
const definitions = nestedSchema.definitions as Record<string, JSONSchema7>;

describe('generateComponentConfig', () => {
  it('should resolve simple $ref', () => {
    const result = parseSchemaProperties(nestedSchema.properties, definitions);

    expect(result.simpleRef).toBeDefined();
    expect(result.simpleRef.type).toBe('custom');
    expect(result.simpleRef.label).toBe('String Property');
  });

  it('should resolve nested $ref', () => {
    const result = parseSchemaProperties(nestedSchema.properties, definitions);

    expect(result.nestedRef).toBeDefined();
    expect(result.nestedRef).toHaveProperty('objectFields');
    expect(result.nestedRef.type).toBe('object');
  });

  it('should resolve $ref in array items', () => {
    const result = parseSchemaProperties(nestedSchema.properties, definitions);
    // @ts-ignore
    expect(result.arrayRef).toBeDefined();
    expect(result.arrayRef).toHaveProperty('arrayFields');
    expect(result.arrayRef.type).toBe('array');
  });

  it('should generate correct component config for a given schema', () => {
    const schema = {
      type: 'object',
      properties: {
        width: { type: 'string' },
        height: { type: 'string' },
        justifyContent: {
          type: 'string',
          enum: ['center', 'flex-end', 'flex-start', 'normal', 'space-around', 'space-between'],
        },
        flexDirection: {
          type: 'string',
          enum: ['column', 'row'],
        },
        backgroundColor: { type: 'string' },
      },
    } as unknown as JSONSchema7;

    const parsedSchemaProps = parseSchemaProperties(schema.properties, {});

    Object.entries(schema.properties).forEach(([key]) => {
      expect(parsedSchemaProps).toHaveProperty(key);
      // @ts-ignore
      const schemaProperty = schema.properties[key];
      if (schemaProperty.enum) {
        // @ts-ignore
        const renderResult = parsedSchemaProps[key]?.render({ a: 4 });
        expect(renderResult.props).toHaveProperty('options');
        expect(renderResult.props).toHaveProperty('default');
        expect(renderResult.props.url).toBe('select');
        const { options } = renderResult.props;
        (options as { value: string; label: string }[]).forEach(option => {
          expect(schemaProperty.enum).toContain(option.value);
        });
      }
      expect(parsedSchemaProps[key]).toHaveProperty('render');
      expect(parsedSchemaProps[key]).toHaveProperty('label');
      expect(parsedSchemaProps[key].type).toBe('custom');
    });
  });

  it('should generate correct component config for an object field', () => {
    const schema = {
      type: 'object',
      properties: {
        link: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
          },
        },
      },
    } as unknown as JSONSchema7;

    const parsedSchemaProps = parseSchemaProperties(schema.properties, {});
    expect(parsedSchemaProps).toHaveProperty('link');
    expect(parsedSchemaProps).not.toHaveProperty('render');
    expect(parsedSchemaProps.link).toHaveProperty('objectFields');
    expect(parsedSchemaProps.link.type).toBe('object');
  });

  it('should correctly handle enum fields from image schema', () => {
    const mockEnumValue = {
      type: 'object',
      required: ['objectFit'],
      properties: {
        objectFit: {
          type: 'string',
          enum: ['contain', 'cover', 'fill', 'none'],
          default: 'cover',
        },
      },
    } as unknown as JSONSchema7;

    const result = generateComponentConfig('Image', {
      component: mockEnumValue,
    } as SchemaContextInfo);

    expect(result.fields).toHaveProperty('objectFit');
    // @ts-ignore
    const objectFitField = result.fields.objectFit;

    expect(objectFitField).toHaveProperty('type', 'custom');
    expect(objectFitField).toHaveProperty('label', 'objectFit');
    expect(objectFitField).toHaveProperty('render');

    // Check if the render function is correctly set up
    if (objectFitField.type === 'custom' && objectFitField.render) {
      // @ts-ignore
      const renderResult = objectFitField.render({});
      // @ts-ignore
      expect(renderResult.props).toHaveProperty('url', 'select');
      // @ts-ignore
      expect(renderResult.props).toHaveProperty('options');
      // @ts-ignore
      expect(renderResult.props.options).toEqual([
        { label: 'contain', value: 'contain' },
        { label: 'cover', value: 'cover' },
        { label: 'fill', value: 'fill' },
        { label: 'none', value: 'none' },
      ]);
      // @ts-ignore
      expect(renderResult.props).toHaveProperty('default', 'cover');
    } else {
      fail('objectFitField should be a custom field with a render function');
    }
  });
});
