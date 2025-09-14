import type { ILogoProps } from '@/elements/Logo';
import type { ISocialList } from '@/elements/SocialList';

/**
 * @title Menu Item
 * @default { "title": "Menu Item", "link": "#" }
 * */
export interface IFooterListChildren {
  /** @title Title */
  title: string;
  /** @title Link */
  link: string;
}

/**
 * @title Menu
 * @default { "title": "Menu", "list": [{ "title": "Menu Item", "link": "#" }] }
 * */
export interface IFooterMenuList {
  /** @title Title section */
  title: string;
  /** @title Menu item */
  list: IFooterListChildren[];
}

export interface FooterProps {
  logo: ILogoProps;
  /** @title Menu */
  menu: IFooterMenuList[];
  /** @title Social Menu */
  social: ISocialList[];
}

export interface HorizontalFooterProps extends FooterProps {}

export interface VerticalFooterProps extends FooterProps, FooterSendEmailProps {}

export interface FooterSendEmailValue {
  email: string;
}

export interface FooterSendEmailProps {
  onSubmit(value: FooterSendEmailValue): void;
}
