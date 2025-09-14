import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import { DEFAULT_OPTIONS_RADIO } from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const CheckboxType = metaType<CheckboxEntity>('form.checkbox');

@entity(CheckboxType)
export class CheckboxEntity extends EditorComponentMeta<CheckboxEntity> {
  /** @title Options */
  options: { label: string; value: string }[] = DEFAULT_OPTIONS_RADIO;
}
