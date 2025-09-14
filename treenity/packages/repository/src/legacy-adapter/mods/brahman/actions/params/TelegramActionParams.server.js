import { btoa } from '../../../../utils/base64';

import { TelegramActionParams } from './TelegramActionParams.meta';

TelegramActionParams.extend({
  helpers: {
    run(ctx) {
      const param = this.base64 ? btoa(ctx.session.param) : ctx.session.param || '';

      const params = param.split(this.split);
      for (let i = 0; i < this.names.length; i++) {
        ctx.set(this.names[i], params[i]);
      }
      // ctx.session.save();
    },
  },
});
