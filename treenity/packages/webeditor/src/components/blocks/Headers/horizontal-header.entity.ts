import {
  DEFAULT_HEADER_LOGO,
  DEFAULT_HEADER_LONG_MENU_LIST,
  DEFAULT_HEADER_SOCIAL_HEADER_LIST,
  type HorizontalHeaderProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const HorizontalHeaderType = metaType<HorizontalHeaderEntity>('layout.horizontalHeader');

@entity(HorizontalHeaderType)
export class HorizontalHeaderEntity {
  /** @title Logo */
  logo: HorizontalHeaderProps['logo'] = DEFAULT_HEADER_LOGO;
  /** @title Menu*/
  menu: HorizontalHeaderProps['menu'] = DEFAULT_HEADER_LONG_MENU_LIST;
  /** @title Social Links */
  social: HorizontalHeaderProps['social'] = DEFAULT_HEADER_SOCIAL_HEADER_LIST;
}
