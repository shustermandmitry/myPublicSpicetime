import { Class } from '../../../../tree';
import { TelegramAction } from '../TelegramAction.meta';

export const KeywordAction = Class.create({
  name: 'tg.action.keywordSelect.elem',
  fields: {
    keywords: {
      type: [String],
      default: () => [],
    },
    message: {
      type: String,
    },
  },
});

export const TelegramActionKeywordSelect = TelegramAction.inherit({
  name: 'tg.action.keywordSelect',
  fields: {
    textFrom: {
      type: String,
      default: '{{data.text}}',
    },
    elements: {
      type: [KeywordAction],
      default: () => [],
    },
  },
});
