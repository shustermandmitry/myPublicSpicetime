import { BotPage } from '../../page/Page.meta';
import { createUserContext } from '../../utils/create-update';
import {
  TelegramActionActionPage,
  TelegramActionPage,
  TelegramActionPageWithUser,
} from './TelegramActionPage.meta';

TelegramActionPage.extend({
  helpers: {
    run(ctx) {
      const pageNode = ctx.botNode.findChildDeep({ _id: this.nodeId });

      if (!pageNode) return void console.log('Node not found');

      const pageMeta = pageNode.getMeta(BotPage);

      return pageMeta.run(ctx);
    },

    callback(ctx) {},
  },
});

TelegramActionPageWithUser.extend({
  helpers: {
    run(ctx) {
      const pageNode = ctx.botNode.findChildDeep({ _id: this.nodeId });

      if (!pageNode) return void console.log('Node not found');

      const pageMeta = pageNode.getMeta(BotPage);
      const context = ctx.get(this.contextFrom);
      const tid = +ctx.format(this.tidFrom);
      const userCtx = createUserContext(ctx.botNode, tid, { context });

      return pageMeta.run(userCtx);
    },

    callback(ctx) {},
  },
});

TelegramActionActionPage.extend({
  helpers: {
    async run(ctx) {
      await this.action.run(ctx);
      return Object.getPrototypeOf(Object.getPrototypeOf(this)).run.call(this, ctx);
    },
  },
});
