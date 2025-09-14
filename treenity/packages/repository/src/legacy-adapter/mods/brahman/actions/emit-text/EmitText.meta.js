import { TelegramAction } from '../TelegramAction.meta';

export const EmitText = TelegramAction.inherit({
  name: 'tg.action.emitText',
  fields: {
    from: {
      type: String,
    },
  },
});
