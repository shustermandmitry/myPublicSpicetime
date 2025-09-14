import { Enum } from '../../../../tree';
import { TelegramActionMenu } from '../menu/TelegramActionMenu.meta';
import TString from '../translate/TString';

const TelegramMessageType = Enum.create({
  name: 'tg.message.type',
  identifiers: {
    TEXT: 'text',
    PHOTO: 'photo',
  },
});

export const TelegramActionQuestion = TelegramActionMenu.inherit({
  name: 'tg.action.question',
  fields: {
    text: {
      // question prompt
      type: TString,
    },
    type: {
      type: TelegramMessageType,
    },
    saveTo: {
      type: String,
      default: 'question',
    },
    deleteMessages: {
      type: Boolean,
      default: false,
    },
  },
  events: {
    beforeSave(e) {
      // e.currentTarget.menuType = TelegramActionMenu.Type.FORCE_REPLY;
      // e.currentTarget.menuType = TelegramActionMenu.Type.NONE;
    },
  },
});
TelegramActionQuestion.Type = TelegramMessageType;
