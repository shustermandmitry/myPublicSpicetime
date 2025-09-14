import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import { type InputStyledSize } from '@treenity/admin-components/components';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const InputType = metaType<InputEntity>('form.input');

@entity(InputType)
export class InputEntity extends EditorComponentMeta<InputEntity> {
  /** @title Default checked */
  size: InputStyledSize = 'middle';
  /** @title Placeholder */
  placeholder: string = '';
}
