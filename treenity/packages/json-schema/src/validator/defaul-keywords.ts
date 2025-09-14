import { JSONType } from 'ajv';

export interface SchemaKeyword {
  keyword: string;
  type: JSONType;
}

export const defaultSchemaKeywords: SchemaKeyword[] = [
  {
    keyword: 'widget',
    type: 'string',
  },
  {
    keyword: 'length',
    type: 'string',
  },
  {
    keyword: 'subtitle',
    type: 'string',
  },
];
