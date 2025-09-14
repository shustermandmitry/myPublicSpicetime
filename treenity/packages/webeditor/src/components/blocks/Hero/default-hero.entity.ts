import {
  DEFAULT_HERO_SECTION_BACKGROUND_COLOR,
  DEFAULT_HERO_SECTION_BACKGROUND_IMAGE,
  DEFAULT_HERO_SECTION_SUBTITLE,
  DEFAULT_HERO_SECTION_TEXT,
  DEFAULT_HERO_SECTION_TITLE,
  type HeroSectionProps,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const DefaultHeroType = metaType<DefaultHeroEntity>('layout.defaultHero');

@entity(DefaultHeroType)
export class DefaultHeroEntity {
  /**
   * @title Title
   * @widget treenity.textarea
   * */
  title: HeroSectionProps['title'] = DEFAULT_HERO_SECTION_TITLE;
  /**
   * @title Subtitle
   * @widget treenity.textarea
   * */
  subtitle: HeroSectionProps['subtitle'] = DEFAULT_HERO_SECTION_SUBTITLE;
  /**
   * @title Text
   * @widget treenity.textarea
   * */
  text: HeroSectionProps['text'] = DEFAULT_HERO_SECTION_TEXT;
  /**
   * @title Image
   * @widget treenity.imageUploadInput
   * */
  backgroundImage: HeroSectionProps['backgroundImage'] = DEFAULT_HERO_SECTION_BACKGROUND_IMAGE;
  /** @title Background */
  backgroundColor: HeroSectionProps['backgroundColor'] = DEFAULT_HERO_SECTION_BACKGROUND_COLOR;
  /** @title Title tag */
  titleTag: HeroSectionProps['titleTag'] = 'p';
}
