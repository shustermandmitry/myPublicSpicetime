import {
  DEFAULT_HERO_SECTION_BACKGROUND_COLOR,
  DEFAULT_HERO_SECTION_BACKGROUND_IMAGE,
  DEFAULT_HERO_SECTION_SUBTITLE,
  DEFAULT_HERO_SECTION_TEXT,
  DEFAULT_HERO_SECTION_TITLE,
  type VerticalHeroSectionProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const VerticalHeroType = metaType<VerticalHeroEntity>('layout.verticalHero');

@entity(VerticalHeroType)
export class VerticalHeroEntity {
  /**
   * @title Title
   * @widget treenity.textarea
   * */
  title: VerticalHeroSectionProps['title'] = DEFAULT_HERO_SECTION_TITLE;
  /**
   * @title Subtitle
   * @widget treenity.textarea
   * */
  subtitle: VerticalHeroSectionProps['subtitle'] = DEFAULT_HERO_SECTION_SUBTITLE;
  /**
   * @title Text
   * @widget treenity.textarea
   * */
  text: VerticalHeroSectionProps['text'] = DEFAULT_HERO_SECTION_TEXT;
  /**
   * @title Image
   * @widget treenity.imageUploadInput
   * */
  backgroundImage: VerticalHeroSectionProps['backgroundImage'] =
    DEFAULT_HERO_SECTION_BACKGROUND_IMAGE;
  /** @title Background */
  backgroundColor: VerticalHeroSectionProps['backgroundColor'] =
    DEFAULT_HERO_SECTION_BACKGROUND_COLOR;
  /** @title Reversed */
  isReversedLayout: VerticalHeroSectionProps['isReversedLayout'] = false;
  /** @title Title tag */
  titleTag: VerticalHeroSectionProps['titleTag'] = 'p';
}
