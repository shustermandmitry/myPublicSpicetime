/*
 * Copyright (c) 2024. Treenity Inc.
 */
import {
  BackgroundThemedValue,
  BorderThemedValue,
  LayoutThemedValue,
  PositionThemedValue,
  ShadowThemedValue,
  SizeThemedValue,
  SpacingThemedValue,
  TextPropsThemedValue,
} from '@treenity/admin-components/widgets';

export type Styles = {
  size?: SizeThemedValue;
  layout?: LayoutThemedValue;
  position?: PositionThemedValue;
  spacing?: SpacingThemedValue;
  background?: BackgroundThemedValue;
  border?: BorderThemedValue;
  shadow?: ShadowThemedValue;
  textEditor?: Partial<TextPropsThemedValue>;
};
