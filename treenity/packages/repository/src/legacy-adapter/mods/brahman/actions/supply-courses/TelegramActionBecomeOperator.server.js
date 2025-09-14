import { TelegramActionBecomeOperator } from './TelegramActionBecomeOperator.meta';
import { TelegramActionSupplyCourses } from './TelegramActionSupplyCourses.meta';
import { TelegramCoursesOperator } from './TelegramCoursesOperator.meta';

TelegramActionBecomeOperator.extend({
  helpers: {
    async run(ctx) {
      const userAlias = ctx.session.params[0];
      if (!userAlias) {
        return ctx.reply(`you must type like this: /${ctx.cmd} alias`);
      }
      const userNode = ctx.botNode.findChildDeep({
        _m: { $elemMatch: { _t: 'tg.user', username: userAlias } },
      });
      if (!userNode) {
        return ctx.reply(`user not found: @${userAlias}`);
      }
      const userId = userNode.getMeta('tg.user').tid;

      const courseOrderNode = ctx.botNode.findChildDeep({
        '_m._t': 'tg.action.academy.courses.create',
      });
      const courseOrderMeta = courseOrderNode.getMeta(TelegramActionSupplyCourses);
      const operatorsChatId = courseOrderMeta.chatId;

      const userInChat = ctx.telegram.getChatMember(operatorsChatId, userId);
      if (!userInChat) {
        return ctx.reply('no user in the operator’s channel');
      }
      const hasOperator = this.node().findChildDeep({
        _m: { $elemMatch: { _t: 'tg.academy.operator', userId: `${userId}` } },
      });
      if (hasOperator) {
        return ctx.reply(`@${userAlias} is operator now`);
      }

      if (userInChat && !hasOperator) {
        const newNode = this.node().ensureChild(`${userAlias}`);
        newNode.addMeta(TelegramCoursesOperator, { userId: `${userId}` });
        newNode.save();
        return ctx.reply(`${userAlias} was successful register as operator`);
      }
    },

    callback(ctx) {},
  },
});
