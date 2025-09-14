import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionBack = TelegramAction.inherit({
  name: 'tg.action.back',
  fields: {},
});

export const TelegramActionDelete = TelegramAction.inherit({
  name: 'tg.action.delete',
  fields: {
    msgIdFrom: {
      type: String,
      default: '',
    },
  },
});
