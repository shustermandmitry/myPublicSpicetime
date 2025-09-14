import findMap from '../../../utils/find-map';
import { TelegramActionMenu } from '../actions/menu/TelegramActionMenu.meta';
import { TelegramAction } from '../actions/TelegramAction.meta';
import { TelegramPageStatistics } from '../actions/ym-statistics/TelegramPageStatistics.meta';
import { BotPage } from './Page.meta';

BotPage.extend({
  helpers: {
    async run(ctx) {
      const statisticsModule = ctx.botNode.getMeta(TelegramPageStatistics);

      if (statisticsModule) {
        statisticsModule.run(ctx);
      }

      const metas = this.node().getMetasInherited(TelegramAction);

      const actions = this.positions
        .map(id => metas.find(m => m._id === id))
        .filter(m => {
          if (!m) console.warn('meta position not found on page', this.node()._id);
          return m;
        });

      return Promise.seq(
        actions.map(act => () => {
          return act.run(ctx);
        }),
      );
    },

    callback(ctx) {
      const menus = this.node().getMetasInherited(TelegramActionMenu);
      return findMap(menus, menu => menu.callback(ctx) || null) || false;
    },
  },
});
