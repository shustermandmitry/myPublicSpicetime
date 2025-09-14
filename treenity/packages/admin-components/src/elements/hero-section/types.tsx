export type TitleTagType = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface HeroSectionProps {
  backgroundImage?: string;
  subtitle?: string;
  title?: string;
  text?: string;
  backgroundColor?: string;
  titleTag?: TitleTagType;
}

export interface HorizontalHeroSectionProps extends HeroSectionProps {
  isReversedLayout?: boolean;
}

export interface VerticalHeroSectionProps extends HeroSectionProps {
  isReversedLayout?: boolean;
}
