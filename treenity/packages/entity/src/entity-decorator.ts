import { MetaName, metaType, types } from '@treenity/core';
import { classFactory } from '@treenity/js-shared/utils';
// 'use server' - we use this only on server, turn off warning
import { getFileFromStack } from './get-file-from-stack';

/**
 * Entity class decorator, decorate class to be make it entity
 * For this classes schema will be generated with the same file name, but `.json` extension
 * @param entityType - MetaType of the entity
 */
export function entity<T>(type: MetaName<T>, context?: string) {
  const entityType = metaType(type, context);
  return function entityDecorator(originalClass: any, context: ClassDecoratorContext): any {
    context.metadata.type = entityType;
    // context.addInitializer(async function (this: any) {
    types.entity.add(entityType, classFactory(originalClass), {
      methods: context.metadata.methods,
    });

    async function loadEntityJson(): Promise<void> {
      let schemaFile = getFileFromStack(4, 'schema.json')!;
      if (schemaFile.endsWith('tslib.schema.json')) {
        // some libs also has tslib initializers called inside
        schemaFile = getFileFromStack(5, 'schema.json')!;
      }

      console.log('loading schema from', schemaFile);
      const schema = JSON.parse(
        JSON.stringify(
          await import(/* @vite-ignore */ schemaFile, { with: { type: 'json' } }).catch(
            (err: Error) => {
              const message = err.message.startsWith('Cannot find module')
                ? `\x1b[34m${schemaFile}\x1b[33m not found`
                : err.message;
              console.warn(`schema for entity '\x1b[32m${entityType.$id}\x1b[33m'`, message);
              return null;
            },
          ),
        ),
      );
      if (schema) {
        const jsonSchema = schema.default?.$schema ? schema.default : schema;
        types.schema.add(entityType, jsonSchema, {});
      }
    }

    // 'use server'
    loadEntityJson();
  };
}
