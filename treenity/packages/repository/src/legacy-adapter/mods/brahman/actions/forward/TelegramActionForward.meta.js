import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionForward = TelegramAction.inherit({
  name: 'tg.action.forward',
  fields: {
    msgIdFrom: {
      type: String,
      default: '',
    },
    toFrom: {
      type: String,
      default: '{{data.to}}',
    },
  },
});
