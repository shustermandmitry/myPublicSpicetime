import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import { type SelectStyledProps } from '@treenity/admin-components/components';
import { DEFAULT_OPTIONS_SELECT } from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const SelectType = metaType<SelectEntity>('form.select');

@entity(SelectType)
export class SelectEntity extends EditorComponentMeta<SelectEntity> {
  /** @title Size */
  size: SelectStyledProps['size'] = 'middle';
  /** @title Options */
  options: { label: string; value: string; disabled: boolean }[] = DEFAULT_OPTIONS_SELECT;
}
