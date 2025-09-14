import { MetaName, metaType, types } from '@treenity/core';
import { wrapClassDecorator } from './utils/decorator-wrappers';
// 'use server' - we use this only on server, turn off warning
import { getFileFromStack } from '@treenity/js-shared/utils';

/**
 * Entity class decorator, decorate class to be make it entity
 * For this classes schema will be generated with the same file name, but `.json` extension
 * @param metaName - MetaType of the entity
 * @param subContext - optional sub context
 */
export function entity<T>(metaName: MetaName<T>, subContext?: string) {
  const type = metaType(metaName, subContext);

  function entityDecorator(originalClass: any, context: ClassDecoratorContext): any {
    context.metadata.type = type;
    context.addInitializer(async function (this: any) {
      const classFactory = (...args: any[]) => new this(...args);

      types.entity.add(type, classFactory, { methods: context.metadata.methods });
      this.toJSON = type.toJSON.bind(type);
      // start 'use server'
      // if (type.$context === 'server') {
      const schemaFile = getFileFromStack(4, 'schema.json')!;
      console.log('loading schema from', schemaFile);
      const schema = JSON.parse(
        JSON.stringify(
          await import(/* @vite-ignore */ schemaFile).catch((err: Error) => {
            const message = err.message.startsWith('Cannot find module')
              ? `\x1b[34m${schemaFile}\x1b[33m not found`
              : err.message;
            console.warn(`schema for entity '\x1b[32m${type.$id}\x1b[33m'`, message);
            return null;
          }),
        ),
      );
      if (schema) {
        types.schema.add(type, schema, {});
      }
      // }
      // end 'use server'
    });
  }

  return wrapClassDecorator(entityDecorator);
}
