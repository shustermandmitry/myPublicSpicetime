import type { ILogoProps } from '../Logo';
import type { IHeaderHeaderContactsList, IHeaderMenuList, IHeaderSocialList } from './types';

export const DEFAULT_HEADER_LOGO: ILogoProps = {
  image: {
    light: '/svg/long-logo-light.svg',
    dark: '/svg/long-logo.svg',
  },
  link: '/',
};

export const DEFAULT_HEADER_MENU_LIST: IHeaderMenuList[] = [
  {
    link: '/',
    label: 'About',
  },
  {
    link: '/',
    label: 'Works',
  },
  {
    link: '/',
    label: 'Contacts',
  },
];

export const DEFAULT_HEADER_LONG_MENU_LIST: IHeaderMenuList[] = [
  {
    link: '/',
    label: 'About',
  },
  {
    link: '/',
    label: 'Works',
  },
  {
    link: '/',
    label: 'Contacts',
  },
  {
    link: '/',
    label: 'Contacts',
  },
  {
    link: '/',
    label: 'Contacts',
  },
  {
    link: '/',
    label: 'Contacts',
  },
];

export const DEFAULT_HEADER_SOCIAL_HEADER_LIST: IHeaderSocialList[] = [
  {
    logo: '/svg/logo.svg',
    link: '/',
  },
  {
    logo: '/svg/logo.svg',
    link: '/',
  },
  {
    logo: '/svg/logo.svg',
    link: '/',
  },
];

export const DEFAULT_HEADER_HEADER_CONTACTS_LIST: IHeaderHeaderContactsList = {
  address: 'NewYork, 50 street, 33',
  phoneNumber: '+7 900 000 00 00',
};
