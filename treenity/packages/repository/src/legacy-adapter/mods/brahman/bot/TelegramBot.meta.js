import { Meta } from '../../../tree';
import TString from '../actions/translate/TString';

export const TelegramBot = Meta.inherit({
  name: 'tg.telegram',
  fields: {
    token: {
      type: String,
      optional: true,
    },
    proxy: {
      type: String,
      optional: true,
    },
    alias: {
      type: String,
      optional: true,
    },
    name: {
      type: String,
      optional: true,
    },
    langs: {
      type: String,
      default: 'ru',
    },
    maintenance: {
      type: TString,
      default: () => ({}),
    },
  },
});
