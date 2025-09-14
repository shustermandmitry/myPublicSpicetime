import { TitleTagType } from '../components/Title';

interface ContactFormBase {
  titleForm?: string;
  action: string;
}

export interface ContactFormSectionProps extends ContactFormBase {
  title?: string;
  text?: string;
  backgroundColor?: string;
  titleTag?: TitleTagType;
}

export interface ContactFormProps extends ContactFormBase {
  variant?: 'horizontal' | 'vertical';
}
