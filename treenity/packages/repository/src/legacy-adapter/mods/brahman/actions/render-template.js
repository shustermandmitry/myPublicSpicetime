import dayjs from 'dayjs';
import * as Handlebars from 'handlebars';
import { md5 } from '../../../utils/md5';

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('tag', function (tag, options) {
  return this.user && this.user.hasTag(tag) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('shortDate', function (date, options) {
  return date instanceof Date ? dayjs(date).format('DD.MM.YY') : '';
});
Handlebars.registerHelper('toFixed', function (num, fraction) {
  return Number(num || 0).toFixed(fraction);
});
Handlebars.registerHelper('is', value => (!!value ? 'true' : ''));
Handlebars.registerHelper('switch', (value, ...cases) => {
  for (let i = 0; i < cases.length - 1; i += 2) {
    if (cases[i] === value) return cases[i + 1];
  }
  return '';
});

Handlebars.registerHelper('and', (...vars) => {
  const options = vars.pop();
  return vars.every(v => v) ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('eval', str => {
  return eval(str);
});

const templates = {};

export default function renderTemplate(text, data) {
  const name = md5(text);
  let template = templates[name];
  if (!template) {
    template = Handlebars.compile(text);

    templates[name] = template;
  }

  return template(data);
}
