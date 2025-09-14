import { Context, ContextImpl, TypeContextInfo } from '../context';

import { MetaName } from '../meta-type';

// export interface Service<M extends Meta = Meta> {
//   setup(params: { meta: M; node: Node }): Promise<void>;
// }

export type ObjectDeserializer<T> = (json: any, ...args: any[]) => T;

export interface ObjectContextOptions {}

export interface ObjectTypeContext extends Context<ObjectDeserializer<any>, ObjectContextOptions> {}

export class ObjectTypeContextImpl
  extends ContextImpl<ObjectDeserializer<any>, ObjectContextOptions>
  implements ObjectTypeContext
{
  getInfo<T>(
    subContext: string,
    typeName?: MetaName<T>,
  ): Promise<TypeContextInfo<ObjectDeserializer<any>, ObjectContextOptions>> {
    return super.getInfo(subContext, typeName).catch(error => {
      if (!subContext || !typeName) throw error;
      // try empty context if specified not found
      return super.getInfo('', typeName);
    });
  }
}
