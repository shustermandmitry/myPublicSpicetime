export interface IContainerWithCardsList {
  /**
   * @title Image
   * @widget treenity.imageUploadInput
   * */
  image?: string;
  /**
   * @title Title
   * */
  title: string;
  /**
   * @title Text
   * */
  text: string;
  /**
   * @title Show button
   * */
  showButton: true;
  /**
   * @title Button text
   * */
  buttonText: string;
  /**
   * @title Action
   * */
  action(): void;
}

export type TContainerWithCardsType = 'horizontal' | 'vertical';

/**
 * @title Component Cards
 * @default {"title": "Title", "text": "Text", "list": ["image": "/svg/logo.svg", "title": "Title", "text": "Text", "showButton": true, "buttonText": "Button", "action": ""] }
 * */
export interface ContainerWithCardsTFCProps extends IContainerWithCardsType {
  title: string;
  /**
   * @title Text
   * @default "Text"
   * */
  text: string;
  list: IContainerWithCardsList[];
}

/**
 * @title Type
 * @default 'horizontal'
 * */
export interface IContainerWithCardsType {
  type: TContainerWithCardsType;
}
