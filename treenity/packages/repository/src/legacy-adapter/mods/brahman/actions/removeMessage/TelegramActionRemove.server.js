import { TelegramActionRemove } from './TelegramActionRemove.meta';

TelegramActionRemove.extend({
  helpers: {
    run(ctx) {
      return ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
    },
  },
});
