import { TelegramActionMenu } from '../menu/TelegramActionMenu.meta';

export const TelegramActionGame = TelegramActionMenu.inherit({
  name: 'tg.action.game',
  fields: {
    defaultSymbol: {
      type: String,
      default: '!',
    },
  },
});
