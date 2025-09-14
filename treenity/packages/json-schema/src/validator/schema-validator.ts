import Ajv, { ErrorObject } from 'ajv';
import { JSONSchema } from 'json-schema-to-ts';
import refResolver from '../ref-resolver';
import { JsonObjectSchema, SchemaValidationError } from '../types';
import { defaultSchemaKeywords, SchemaKeyword } from './defaul-keywords';

/**
 * A validation function that takes data and returns the (possibly coerced)
 * data or throws a validation error.
 */
export type Validator<T = any, R = T> = (data: T) => Promise<R>;

/**
 * Returns a compiled validation function for a schema and AJV validator instance.
 *
 * @param schema The JSON schema definition
 * @param validator The AJV validation instance
 * @returns A compiled validation function
 */
export const getValidator = <T = any, R = T>(
  schema: JSONSchemaDefinition,
  validator: Ajv,
): Validator<T, R> =>
  validator.compile({
    $async: true,
    ...(schema as any),
  }) as any as Validator<T, R>;

export type JSONSchemaDefinition = JSONSchema & {
  $id: string;
  $async?: true;
  properties?: { [key: string]: JSONSchema };
  required?: readonly string[];
};

class SchemaValidator {
  ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      loadSchema: async (uri: string) =>
        // @ts-ignore
        (await refResolver<any>({ item: { $ref: uri } })) as JsonObjectSchema,
    });

    this.addKeywords(defaultSchemaKeywords);
  }

  addKeywords = (keywords: SchemaKeyword | SchemaKeyword[]) => {
    (Array.isArray(keywords) ? keywords : [keywords]).map(keyword => this.ajv.addKeyword(keyword));
  };

  async validate(
    values: any,
    schema: JsonObjectSchema,
  ): Promise<[boolean, ErrorObject[] | undefined]> {
    const validator = await this.ajv.compileAsync(schema);
    try {
      const isValid = await validator(values);
      return [isValid, undefined];
    } catch (e) {
      // @ts-ignore
      return [false, e.errors as ErrorObject[]];
    }
  }
}

const validateSchema = async (
  values: any,
  schema: JsonObjectSchema,
  keywords?: SchemaKeyword | SchemaKeyword[],
): Promise<[boolean, SchemaValidationError[] | undefined]> => {
  const validator = new SchemaValidator();
  if (keywords) {
    validator.addKeywords(keywords);
  }

  const schemaAsync = Object.create(schema);
  schemaAsync.$async = true;

  return validator.validate(values, schemaAsync);
};

export default validateSchema;
