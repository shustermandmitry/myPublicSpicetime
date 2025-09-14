import { TelegramAction } from '../TelegramAction.meta';

export const CurrentGame = TelegramAction.inherit({
  name: 'tg.currentGame',
  fields: {
    menuId: String,
  },
});
