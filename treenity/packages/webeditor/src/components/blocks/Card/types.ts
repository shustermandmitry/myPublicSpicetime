import { RenderItemFunction } from '@/types';
import { Styles } from '@/types/styles';

export type CardWidth = 'auto' | '100%' | 'min' | 'max';
export type CardElevation = 'low' | 'medium' | 'high';

export interface CardItem {
  id: string;
}

export interface CardProps {
  width: CardWidth;
  elevation: CardElevation;
  renderItem: RenderItemFunction<CardItem>;
  styles: Styles;
}
