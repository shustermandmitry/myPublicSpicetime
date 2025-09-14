import { BotPage } from '../../page/Page.meta';
import { TelegramActionBack, TelegramActionDelete } from './TelegramActionBack.meta';

TelegramActionBack.extend({
  helpers: {
    run(ctx) {
      ctx.session.history.pop();
      const nodeId = ctx.session.history.pop();
      const pageNode = ctx.botNode.findChildDeep({ _id: nodeId });
      return pageNode.getMeta(BotPage).run(ctx);
    },
  },
});

TelegramActionDelete.extend({
  helpers: {
    run(ctx) {
      if (this.msgIdFrom) {
        ctx.deleteMessage(ctx.format(this.msgIdFrom));
      } else {
        ctx.deleteMessage();
      }
    },
  },
});
