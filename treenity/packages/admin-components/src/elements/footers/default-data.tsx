import type { ILogoProps } from '@/elements/Logo';
import type { ISocialList } from '@/elements/SocialList';
import type { IFooterMenuList } from './types';

export const DEFAULT_FOOTER_LOGO: ILogoProps = {
  image: {
    light: '/svg/long-logo-light.svg',
    dark: '/svg/long-logo.svg',
  },
  link: '/',
};

export const DEFAULT_FOOTER_MENU_LIST: IFooterMenuList[] = [
  {
    title: 'Content',
    list: [
      {
        title: 'Authors',
        link: '/',
      },
      {
        title: 'Resources',
        link: '/',
      },
      {
        title: 'Career',
        link: '/',
      },
      {
        title: 'Out source',
        link: '/',
      },
    ],
  },
  {
    title: 'Community',
    list: [
      {
        title: 'About us',
        link: '/',
      },
      {
        title: 'Contacts',
        link: '/',
      },
      {
        title: 'Licences',
        link: '/',
      },
      {
        title: 'Blog',
        link: '/',
      },
    ],
  },
  {
    title: 'Help',
    list: [
      {
        title: 'Support',
        link: '/',
      },
      {
        title: 'FAQ',
        link: '/',
      },
      {
        title: 'Subscribe',
        link: '/',
      },
    ],
  },
];

export const DEFAULT_FOOTER_SOCIAL_LIST: ISocialList[] = [
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
