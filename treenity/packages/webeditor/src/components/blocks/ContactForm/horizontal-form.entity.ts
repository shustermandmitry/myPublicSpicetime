import {
  ContactFormSectionProps,
  DEFAULT_CONTACT_FORM_ACTION,
  DEFAULT_CONTACT_FORM_BACKGROUND_COLOR,
  DEFAULT_CONTACT_FORM_TEXT,
  DEFAULT_CONTACT_FORM_TITLE,
  DEFAULT_CONTACT_FORM_TITLE_FORM,
} from '@treenity/admin-components/elements';
import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const HorizontalContactFormType = metaType<HorizontalContactFormEntity>(
  'form-components.horizontalContactForm',
);

@entity(HorizontalContactFormType)
export class HorizontalContactFormEntity {
  /** @title Title */
  titleForm?: ContactFormSectionProps['titleForm'] = DEFAULT_CONTACT_FORM_TITLE;
  /** @title Action */
  action: ContactFormSectionProps['action'] = DEFAULT_CONTACT_FORM_ACTION;
  /** @title Title */
  title?: ContactFormSectionProps['title'] = DEFAULT_CONTACT_FORM_TITLE_FORM;
  /**
   * @title Text
   * @widget treenity.textarea
   * */
  text?: ContactFormSectionProps['text'] = DEFAULT_CONTACT_FORM_TEXT;
  /** @title Background */
  backgroundColor?: ContactFormSectionProps['backgroundColor'] =
    DEFAULT_CONTACT_FORM_BACKGROUND_COLOR;
  /** @title Title tag */
  titleTag: ContactFormSectionProps['titleTag'] = 'p';
}
