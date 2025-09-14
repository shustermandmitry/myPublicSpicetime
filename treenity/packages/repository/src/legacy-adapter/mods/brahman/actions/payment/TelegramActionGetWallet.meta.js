import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionGetWallet = TelegramAction.inherit({
  name: 'tg.action.wallet.get',
  fields: {
    coinName: {
      type: String,
      optional: false,
    },
    fromNodeId: {
      type: String,
      default: '{{node._id}}',
    },
    saveTo: {
      type: String,
      optional: false,
    },
  },
});
