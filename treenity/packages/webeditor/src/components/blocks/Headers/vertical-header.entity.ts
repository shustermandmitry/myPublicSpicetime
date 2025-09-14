import {
  DEFAULT_HEADER_HEADER_CONTACTS_LIST,
  DEFAULT_HEADER_LOGO,
  DEFAULT_HEADER_LONG_MENU_LIST,
  DEFAULT_HEADER_SOCIAL_HEADER_LIST,
  VerticalHeaderProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const VerticalHeaderType = metaType<VerticalHeaderEntity>('layout.verticalHeader');

@entity(VerticalHeaderType)
export class VerticalHeaderEntity {
  /** @title Logo */
  logo: VerticalHeaderProps['logo'] = DEFAULT_HEADER_LOGO;
  /** @title Menu*/
  menu: VerticalHeaderProps['menu'] = DEFAULT_HEADER_LONG_MENU_LIST;
  /** @title Social Links */
  social: VerticalHeaderProps['social'] = DEFAULT_HEADER_SOCIAL_HEADER_LIST;
  /** @title Contacts */
  contacts: VerticalHeaderProps['contacts'] = DEFAULT_HEADER_HEADER_CONTACTS_LIST;
}
