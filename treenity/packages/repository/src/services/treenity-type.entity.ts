import { Meta, metaType } from '@treenity/core';
import { entity, EntityImpl } from '@treenity/entity';
export const TreenityTypeType = metaType<TrenityType>('treenity.type');

@entity(TreenityTypeType)
export class TrenityType extends EntityImpl<TrenityType> {
  name!: string;
  component!: any;
  options!: any;

  constructor(raw?: Partial<Meta<TrenityType>>) {
    super();
    raw && Object.assign(this, raw);
  }
}
