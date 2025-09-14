import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import {
  type AntdRadioGroupProps,
  DEFAULT_OPTIONS_RADIO,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const RadioType = metaType<RadioEntity>('form.radio');

@entity(RadioType)
export class RadioEntity extends EditorComponentMeta<RadioEntity> {
  /** @title Default value */
  defaultValue: AntdRadioGroupProps['defaultValue'] = DEFAULT_OPTIONS_RADIO[0].value;
  /** @title Options */
  options: { label: string; value: string }[] = DEFAULT_OPTIONS_RADIO;
  /**
   *  @title Options type
   * @widget treenity.select
   * */
  optionType: AntdRadioGroupProps['optionType'] = 'default';
}
