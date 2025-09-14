import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionSetValue = TelegramAction.inherit({
  name: 'tg.action.setValue',
  fields: {
    value: {
      type: String,
      form: {
        type: 'textarea',
      },
    },
    saveTo: String,
  },
});
export const TelegramActionEval = TelegramAction.inherit({
  name: 'tg.action.eval',
  fields: {
    value: {
      type: String,
      default: '',
    },
  },
});
