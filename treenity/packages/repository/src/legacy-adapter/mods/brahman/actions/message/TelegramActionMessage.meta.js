import { TelegramActionMenu } from '../menu/TelegramActionMenu.meta';
import TString from '../translate/TString';

export const TelegramActionMessage = TelegramActionMenu.inherit({
  name: 'tg.action.message',
  fields: {
    disableLinks: {
      type: Boolean,
      default: false,
    },
    text: {
      type: TString,
    },
  },
});

export const TelegramActionMessageChat = TelegramActionMessage.inherit({
  name: 'tg.action.message.chat',
  fields: {
    chatId: {
      type: String,
    },
  },
});

export const TelegramActionMessageReply = TelegramActionMessage.inherit({
  name: 'tg.action.message.reply',
  fields: {
    msgIdFrom: {
      type: String,
    },
  },
});
