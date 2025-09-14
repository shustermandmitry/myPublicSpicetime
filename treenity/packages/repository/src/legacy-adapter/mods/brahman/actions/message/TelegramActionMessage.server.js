import { Extra } from 'telegraf';
import { sendKeyboard } from './sendKeyboard';
import {
  TelegramActionMessage,
  TelegramActionMessageChat,
  TelegramActionMessageReply,
} from './TelegramActionMessage.meta';

TelegramActionMessage.extend({
  helpers: {
    run(ctx) {
      this.runMenu(ctx);
      const text = ctx.format(this.text);

      const keyboard = this.keyboard(ctx, { tags: ctx.user._tg });

      return sendKeyboard(ctx, text, keyboard, Extra.webPreview(!this.disableLinks), this.menuType);
    },
  },
});

TelegramActionMessageChat.extend({
  helpers: {
    run(ctx) {
      this.runMenu(ctx);
      const text = ctx.format(this.text);
      const chatId = +ctx.format(this.chatId);
      return ctx.telegram.sendMessage(chatId, text, {
        ...this.keyboard(ctx, { tags: ctx.user._tg }),
        ...Extra.HTML(true).webPreview(!this.disableLinks),
      });
    },
  },
});

TelegramActionMessageReply.extend({
  helpers: {
    run(ctx) {
      this.runMenu(ctx);
      const text = ctx.format(this.text);
      const msgIdFrom = +ctx.format(this.msgIdFrom);
      return ctx.telegram.sendMessage(ctx.chat.id, text, {
        ...this.keyboard(ctx, { tags: ctx.user._tg }),
        ...Extra.HTML(true).webPreview(!this.disableLinks),
        reply_to_message_id: msgIdFrom,
      });
    },
  },
});
