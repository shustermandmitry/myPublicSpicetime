import { TelegramActionResetSession } from './ResetSession.meta';

TelegramActionResetSession.extend({
  helpers: {
    run(ctx) {
      ctx.session.data = {};
      ctx.session.chat = {};
    },
  },
});
