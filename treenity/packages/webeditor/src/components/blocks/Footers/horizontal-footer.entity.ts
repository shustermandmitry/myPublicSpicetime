import {
  DEFAULT_FOOTER_LOGO,
  DEFAULT_FOOTER_MENU_LIST,
  DEFAULT_FOOTER_SOCIAL_LIST,
  type HorizontalFooterProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const HorizontalFooterType = metaType<HorizontalFooterEntity>('layout.horizontalFooter');

@entity(HorizontalFooterType)
export class HorizontalFooterEntity {
  /** @title Logo */
  logo: HorizontalFooterProps['logo'] = DEFAULT_FOOTER_LOGO;
  /** @title Menu */
  menu: HorizontalFooterProps['menu'] = DEFAULT_FOOTER_MENU_LIST;
  /** @title Social */
  social: HorizontalFooterProps['social'] = DEFAULT_FOOTER_SOCIAL_LIST;
}
