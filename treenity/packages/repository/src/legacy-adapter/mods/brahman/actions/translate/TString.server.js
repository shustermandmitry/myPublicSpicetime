import renderTemplate from '../render-template';
import TString from './TString';

TString.extend({
  helpers: {
    format(l, data) {
      const str = this[l] || this.en || '';
      return data ? renderTemplate(str, data) : str;
    },
  },
});
