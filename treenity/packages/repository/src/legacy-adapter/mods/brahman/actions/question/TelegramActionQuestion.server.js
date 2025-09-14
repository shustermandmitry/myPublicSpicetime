import { TelegramActionQuestion } from './TelegramActionQuestion.meta';

TelegramActionQuestion.extend({
  helpers: {
    async run(ctx) {
      this.runMenu(ctx);
      // const text = this.text.format(ctx.getLang(), ctx.session);
      const text = ctx.format(this.text);
      const questionMsg = await ctx.replyWithHTML(text, this.keyboard(ctx, { tags: ctx.user._tg }));

      ctx.session.prom = ctx.session.prom || {};
      // wait this type
      const prom = (ctx.session.prom[this.saveTo] = ctx.wait(this.type));
      const repCtx = await prom;
      this.callback(repCtx);
      delete ctx.session.prom[this.saveTo];
      if (this.deleteMessages) {
        ctx.deleteMessage(questionMsg.message_id);
        ctx.deleteMessage(repCtx.message.message_id);
      }
    },
    callback(ctx) {
      if (ctx.session.prom && ctx.session.prom[this.saveTo]) {
        if (!ctx.message || !ctx.message[this.type]) {
          ctx.session.prom[this.saveTo].reject(new Error('cancel'));
        } else {
          ctx.set(this.saveTo, ctx.message[this.type]);
          ctx.set(`${this.saveTo}Msg`, ctx.message);
        }
        delete ctx.session.prom[this.saveTo];
      }
    },
  },
});
