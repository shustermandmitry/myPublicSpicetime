import { TelegramActionResetHistory } from './ResetSession.meta';

TelegramActionResetHistory.extend({
  helpers: {
    run(ctx) {
      ctx.session.history = [];
    },
  },
});
