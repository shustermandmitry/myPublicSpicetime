import { Class } from '../../../../tree';

const TString = Class.create({
  name: 'tstring',
  fields: {
    ru: {
      type: String,
      default: '',
    },
    en: {
      type: String,
      default: '',
    },
    // es: {
    //   type: String,
    //   default: '',
    // },
    de: {
      type: String,
      default: '',
    },
    uz: {
      type: String,
      default: '',
    },
  },
  helpers: {
    includes(str) {
      return this.ru === str || this.en === str || this.de === str || this.uz === str; // this.es === str;
    },
    toString(lang) {
      return this[lang] || this.en || this.ru;
    },
  },
});

TString.forAll = str => {
  return new TString({ ru: str, en: str, es: str, de: str, uz: str });
};

TString.toTString = str => {
  return str instanceof TString ? new TString(str) : TString.forAll(str);
};

export default TString;
