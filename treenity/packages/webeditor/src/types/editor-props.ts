import { CSSProperties } from 'react';
import { Styles } from './styles';
import { Entity } from '@treenity/entity';

export type EditorProps<T extends Record<string, unknown>> = {
  className?: string;
  style: CSSProperties;
  renderItem?: RenderItemFunction;
  id: string;
  mergedMeta: T;
} & T;

export type SharedProps = {
  hidden: boolean;
  styles: Partial<Styles>;
};

export type RenderItemFunction<
  T extends { id: string } = Record<string, unknown> & { id: string },
> = (item: T) => React.ReactNode;

export type WithEditorProps<T extends Record<string, any>, D = any> = EditorProps<T> & {
  value: Entity<D>;
};
