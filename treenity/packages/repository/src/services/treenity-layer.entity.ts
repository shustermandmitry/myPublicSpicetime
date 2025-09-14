import { Meta, metaType } from '@treenity/core';
import { EntityImpl, entity } from '@treenity/entity';

export const TreenityLayerType = metaType<TrenityLayer>('treenity.layer');

@entity(TreenityLayerType)
export class TrenityLayer extends EntityImpl<TrenityLayer> {
  name!: string;

  constructor(raw?: Partial<Meta<TrenityLayer>>) {
    super();
    raw && Object.assign(this, raw);
  }
}
