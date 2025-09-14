import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionGetParams = TelegramAction.inherit({
  name: 'tg.action.crypto.getRates',
  fields: {
    coin: {
      type: String,
    },
    curr: {
      type: String,
    },
    factor: {
      type: Number,
    },
    random: {
      type: Number,
      default: 10,
    },
    amountFrom: {
      type: String,
    },
    saveTo: {
      type: String,
    },
  },
});
