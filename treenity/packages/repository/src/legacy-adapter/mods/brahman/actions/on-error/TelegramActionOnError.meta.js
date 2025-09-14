import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionOnError = TelegramAction.inherit({
  name: 'tg.action.onError',
  fields: {
    error: {
      type: String,
    },
    action: {
      type: TelegramAction,
      optional: true,
    },
  },
});
