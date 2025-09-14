import {
  DEFAULT_HEADER_LOGO,
  DEFAULT_HEADER_LONG_MENU_LIST,
  DEFAULT_HEADER_SOCIAL_HEADER_LIST,
  DefaultHeaderProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const DefaultHeaderType = metaType<DefaultHeaderEntity>('layout.header');

@entity(DefaultHeaderType)
export class DefaultHeaderEntity {
  /** @title Logo */
  logo: DefaultHeaderProps['logo'] = DEFAULT_HEADER_LOGO;
  /** @title Menu*/
  menu: DefaultHeaderProps['menu'] = DEFAULT_HEADER_LONG_MENU_LIST;
  /** @title Social Links */
  social: DefaultHeaderProps['social'] = DEFAULT_HEADER_SOCIAL_HEADER_LIST;
}
