import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionSplitCoins = TelegramAction.inherit({
  name: 'tg.action.wallet.split',
  fields: {
    coinName: {
      type: String,
      optional: false,
    },
    fromNodeId: {
      type: String,
      default: '{{node._id}}',
    },
    toNodesByTag: {
      type: String,
      default: '{{node.name}}',
    },
    splitEqualParts: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: String,
      default: '{{params.[0]}}',
    },
  },
});
