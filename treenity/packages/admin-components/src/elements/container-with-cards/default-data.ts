import { IContainerWithCardsList, TContainerWithCardsType } from './types';

export const DEFAULT_CONTAINER_WITH_CARDS_TITLE = 'My Advantages';
export const DEFAULT_CONTAINER_WITH_CARDS_TEXT =
  'A main landing block is usually a prominent section of a website or application that serves as the entry point for users and is typically the first thing that users see when they visit the site.';
export const DEFAULT_CONTAINER_WITH_CARDS_TYPE: TContainerWithCardsType = 'horizontal';
export const DEFAULT_CONTAINER_WITH_CARDS_LIST: IContainerWithCardsList[] = [
  {
    image: '/svg/logo.svg',
    title: 'Title 1',
    text: 'A main landing block is usually a prominent section of a website or application that',
    showButton: true,
    buttonText: 'Button',
    action: () => {},
  },
  {
    image: '/svg/logo.svg',
    title: 'Title 2',
    text: 'A main landing block is usually a prominent section of a website or application that',
    showButton: true,
    buttonText: 'Button',
    action: () => {},
  },
  {
    image: '/svg/logo.svg',
    title: 'Title 3',
    text: 'A main landing block is usually a prominent section of a website or application that',
    showButton: true,
    buttonText: 'Button',
    action: () => {},
  },
  {
    image: '/svg/logo.svg',
    title: 'Title 4',
    text: 'A main landing block is usually a prominent section of a website or application that',
    showButton: true,
    buttonText: 'Button',
    action: () => {},
  },
];
