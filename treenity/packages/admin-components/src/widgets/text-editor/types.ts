export interface TextPropsThemedValue {
  align: string;
  text: string;
  color: string;
  fontFamily: string;
  fontWeight: string;
  size: string;
  opacity: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textStyle: 'normal' | 'italic';
  textDecoration: string;
  textType: string;
  textList: string;
}

export interface TextPropsThemedProps {
  onChange?(value: Partial<TextPropsThemedValue>): void;
  value?: Partial<TextPropsThemedValue>;
}

export type FONT_LIST_NAMES =
  | 'addListCircleOutlined'
  | 'addListSquareOutlined'
  | 'listNumbersParenthesis'
  | 'listLettersParenthesis';

export type FONT_TYPE_NAMES = 'code' | 'quote' | 'h3' | 'h4' | 'h5' | 'h6';
