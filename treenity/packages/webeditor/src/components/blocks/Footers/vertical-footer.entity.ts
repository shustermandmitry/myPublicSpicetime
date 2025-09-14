import {
  DEFAULT_FOOTER_LOGO,
  DEFAULT_FOOTER_MENU_LIST,
  DEFAULT_FOOTER_SOCIAL_LIST,
  type VerticalFooterProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const VerticalFooterType = metaType<VerticalFooterEntity>('layout.verticalFooter');

@entity(VerticalFooterType)
export class VerticalFooterEntity {
  /** @title Logo */
  logo: VerticalFooterProps['logo'] = DEFAULT_FOOTER_LOGO;
  /** @title Menu */
  menu: VerticalFooterProps['menu'] = DEFAULT_FOOTER_MENU_LIST;
  /** @title Social */
  social: VerticalFooterProps['social'] = DEFAULT_FOOTER_SOCIAL_LIST;
}
