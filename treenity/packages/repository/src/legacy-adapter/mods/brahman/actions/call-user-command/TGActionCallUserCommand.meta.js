const { TelegramAction } = require('../TelegramAction.meta');

export const TelegramActionSetTelegramUser = TelegramAction.inherit({
  name: 'tg.setTelegramUser',
  fields: {
    tid: Number,
    message: { type: String, default: '' },
  },
});

if (globalThis.isServer) {
  TelegramActionSetTelegramUser.extend({
    helpers: {
      async run(ctx) {
        const tgMeta = ctx.usersByTid(this.tid);
        if (!tgMeta) {
          return ctx.replyWithHTML(`user not found ${this.tid}`);
        }

        Object.assign(ctx.message, {
          system: true,
          from: {
            id: this.tid,
            is_bot: false,
            first_name: tgMeta.firstName,
            username: tgMeta.username,
            language_code: tgMeta.lang,
          },
          chat: {
            id: this.tid,
            first_name: tgMeta.firstName,
            username: tgMeta.username,
            type: 'private',
          },
          entities: [],
        });

        ctx.user = tgMeta;
        ctx.session = await ctx.bot.sessionMiddleware.getSession(ctx.from.id, ctx.chat.id);
      },
    },
  });
}
