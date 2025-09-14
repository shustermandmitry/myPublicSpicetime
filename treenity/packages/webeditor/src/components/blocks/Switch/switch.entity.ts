import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import { type SwitchStyledProps } from '@treenity/admin-components/components';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const SwitchType = metaType<SwitchEntity>('form.switch');

@entity(SwitchType)
export class SwitchEntity extends EditorComponentMeta<SwitchEntity> {
  /** @title Size */
  size: SwitchStyledProps['size'] = 'default';
}
