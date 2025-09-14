import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionGetValue = TelegramAction.inherit({
  name: 'tg.action.getValue',
  fields: {
    path: String,
    saveTo: String,
  },
});
