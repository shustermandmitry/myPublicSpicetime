import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionBroadcast = TelegramAction.inherit({
  name: 'tg.action.broadcast',
  fields: {
    userTags: {
      type: [String],
      default: () => [],
    },
    action: {
      type: TelegramAction,
      optional: true,
      // form: {
      //   hide: true,
      // },
    },
  },
});
