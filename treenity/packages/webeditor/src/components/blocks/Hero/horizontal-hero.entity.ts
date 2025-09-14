import {
  DEFAULT_HERO_SECTION_BACKGROUND_COLOR,
  DEFAULT_HERO_SECTION_BACKGROUND_IMAGE,
  DEFAULT_HERO_SECTION_SUBTITLE,
  DEFAULT_HERO_SECTION_TEXT,
  DEFAULT_HERO_SECTION_TITLE,
  type HorizontalHeroSectionProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const HorizontalHeroType = metaType<HorizontalHeroEntity>('layout.horizontalHero');

@entity(HorizontalHeroType)
export class HorizontalHeroEntity {
  /**
   * @title Title
   * @widget treenity.textarea
   * */
  title: HorizontalHeroSectionProps['title'] = DEFAULT_HERO_SECTION_TITLE;
  /**
   * @title Subtitle
   * @widget treenity.textarea
   * */
  subtitle: HorizontalHeroSectionProps['subtitle'] = DEFAULT_HERO_SECTION_SUBTITLE;
  /**
   * @title Text
   * @widget treenity.textarea
   * */
  text: HorizontalHeroSectionProps['text'] = DEFAULT_HERO_SECTION_TEXT;
  /**
   * @title Image
   * @widget treenity.imageUploadInput
   * */
  backgroundImage: HorizontalHeroSectionProps['backgroundImage'] =
    DEFAULT_HERO_SECTION_BACKGROUND_IMAGE;
  /** @title Background */
  backgroundColor: HorizontalHeroSectionProps['backgroundColor'] =
    DEFAULT_HERO_SECTION_BACKGROUND_COLOR;
  /** @title Reversed */
  isReversedLayout: HorizontalHeroSectionProps['isReversedLayout'] = false;
  /** @title Title tag */
  titleTag: HorizontalHeroSectionProps['titleTag'] = 'p';
}
