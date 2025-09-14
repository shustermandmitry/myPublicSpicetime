import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionParams = TelegramAction.inherit({
  name: 'tg.action.params',
  fields: {
    base64: {
      type: Boolean,
      default: false,
    },
    split: {
      type: String,
      default: ',',
    },
    names: {
      type: [String],
      default: () => ['param'],
    },
  },
});
