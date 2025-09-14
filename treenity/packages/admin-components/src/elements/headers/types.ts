import type { ILogoProps } from '../Logo';
import { ISocialList } from '../SocialList';

/** @title Menu */
export interface IHeaderMenuProps {
  /** @title Label */
  label: string;
  /**
   * @title Link
   * @widget treenity.selectLink
   */
  link: string;
}

/** @title Menu Item */
export interface IHeaderMenuList {
  /** @title Link */
  link: string;
  /** @title Label */
  label: string;
}

/** @title Social */
export interface IHeaderSocialList {
  /** @title Logo */
  logo: string;
  /** @title Link */
  link: string;
}

/** @title Contact */
export interface IHeaderHeaderContactsList {
  /** @title Address */
  address: string;
  /** @title Phone Number */
  phoneNumber: string;
}

/** @title Header */
export interface HeaderProps {
  /** @title Logo */
  logo: ILogoProps;
  /** @title Menu Item */
  menu: IHeaderMenuProps[];
  /** @title Social */
  social: ISocialList[];
}

export interface DefaultHeaderProps extends HeaderProps {}

export interface HorizontalHeaderProps extends HeaderProps {}

export interface VerticalHeaderProps extends HeaderProps {
  /** @title Contacts */
  contacts: IHeaderHeaderContactsList;
}
