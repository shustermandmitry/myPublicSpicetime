import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionIfElse = TelegramAction.inherit({
  name: 'tg.action.ifElse',
  fields: {
    condition: {
      type: String,
    },
    stopAfterAction: {
      type: Boolean,
      default: false,
    },
    actionIf: {
      type: TelegramAction,
      optional: true,
    },
    actionElse: {
      type: TelegramAction,
      optional: true,
    },
  },
});
