// import React from 'react';
// import {} from '../../../../tree';
import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionSendCoins = TelegramAction.inherit({
  name: 'tg.action.wallet.send',
  fields: {
    coinName: {
      type: String,
      optional: false,
    },
    fromNodeId: {
      type: String,
      default: '{{node._id}}',
    },
    toNodeId: {
      type: String,
      default: '{{params.[0]}}',
    },
    amount: {
      type: String,
      default: '{{params.[1]}}',
    },
  },
});
