import { get } from '@s-libs/micro-dash';
import { TelegramActionOnError } from './TelegramActionOnError.meta';

TelegramActionOnError.extend({
  helpers: {
    run(ctx) {
      // nothing to do without it
      if (!this.action) return;

      const error = ctx.session.error;
      const reason = get(error, 'tx.reason', error.message || '');
      if (reason.includes(this.error)) {
        return this.action.run(ctx);
      }
    },
  },
});
