import { get } from '@s-libs/micro-dash';
import { TelegramActionGetValue } from './GetValue.meta';

TelegramActionGetValue.extend({
  helpers: {
    run(ctx) {
      ctx.session.data[this.saveTo] = get(ctx, this.path);
    },
  },
});
