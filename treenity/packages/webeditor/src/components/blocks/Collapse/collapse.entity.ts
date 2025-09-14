import { EditorComponentMeta } from '@/components/blocks/shared/EditorMeta';
import {
  DEFAULT_COLLAPSE_ACCORDION,
  DEFAULT_COLLAPSE_BORDERED,
  DEFAULT_COLLAPSE_COLLAPSIBLE,
  DEFAULT_COLLAPSE_EXPAND_ICON_POSITION,
  DEFAULT_COLLAPSE_GHOST,
  DEFAULT_COLLAPSE_LIST,
  DEFAULT_COLLAPSE_SIZE,
  type ICollapseProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const CollapseType = metaType<CollapseEntity>('advanced.collapse');

@entity(CollapseType)
export class CollapseEntity extends EditorComponentMeta<ICollapseProps> {
  /** @title List */
  list: ICollapseProps['list'] = DEFAULT_COLLAPSE_LIST;
  /** @title Size */
  size: ICollapseProps['size'] = DEFAULT_COLLAPSE_SIZE;
  /** @title Accordion */
  accordion: ICollapseProps['accordion'] = DEFAULT_COLLAPSE_ACCORDION;
  /** @title Bordered */
  bordered: ICollapseProps['bordered'] = DEFAULT_COLLAPSE_BORDERED;
  /** @title Expand icon position */
  expandIconPosition: ICollapseProps['expandIconPosition'] = DEFAULT_COLLAPSE_EXPAND_ICON_POSITION;
  /** @title Ghost */
  ghost: ICollapseProps['ghost'] = DEFAULT_COLLAPSE_GHOST;
  /** @title Collapsible */
  collapsible: ICollapseProps['collapsible'] = DEFAULT_COLLAPSE_COLLAPSIBLE;
}
