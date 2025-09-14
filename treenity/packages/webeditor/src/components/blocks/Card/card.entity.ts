import DEFAULT_STYLES from '@/constants/styles';

import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

import type { CardProps } from './types';

export const CardType = metaType<CardEntity>('markup.card');

@entity(CardType)
export class CardEntity {
  width: CardProps['width'] = 'auto';
  elevation: CardProps['elevation'] = 'medium';
  styles: CardProps['styles'] = {
    shadow: DEFAULT_STYLES.shadow,
    spacing: DEFAULT_STYLES.spacing,
    background: DEFAULT_STYLES.background,
    border: DEFAULT_STYLES.border,
  };
}
