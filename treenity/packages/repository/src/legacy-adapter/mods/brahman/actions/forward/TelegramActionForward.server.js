import { TelegramActionForward } from './TelegramActionForward.meta';

TelegramActionForward.extend({
  helpers: {
    async run(ctx) {
      const to = ctx.format(this.toFrom);
      if (!this.msgIdFrom) return ctx.forwardMessage(to);
      else {
        const result = await ctx.telegram.forwardMessage(
          to,
          ctx.chat.id,
          ctx.format(this.msgIdFrom),
        );
        ctx.forwarded = result;
        return result;
      }
    },
  },
});
