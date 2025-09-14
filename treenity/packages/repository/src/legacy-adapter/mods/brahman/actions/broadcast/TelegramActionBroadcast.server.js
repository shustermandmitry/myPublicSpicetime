import { warn } from '../../../../utils/log';
import { TelegramUser } from '../../User.meta';
import { createUserContext } from '../../utils/create-update';
import { TelegramActionBroadcast } from './TelegramActionBroadcast.meta';

TelegramActionBroadcast.extend({
  helpers: {
    run(ctx) {
      if (!this.action) return;

      // const tag = ctx.format(this.userTag);

      const selector = {
        _m: { $elemMatch: { _t: 'tg.user', blocked: false, banned: false } },
      };
      if (this.userTags.length) {
        selector._m.$elemMatch._tg = { $in: this.userTags };
      }

      const userNodes = ctx.usersNode.findChildren(selector);

      if (!userNodes.length) return;

      return Promise.seq(
        userNodes.map(node => async () => {
          const userMeta = node.getMeta(TelegramUser);
          if (!userMeta) return;

          const userContext = createUserContext(ctx.botNode, userMeta.tid);

          try {
            await this.action.run(userContext);
          } catch (err) {
            warn('BROADCAST', userMeta.tid, err);
          }
        }),
      );
    },
  },
});
