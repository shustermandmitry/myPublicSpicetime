import { Context, Telegram } from 'telegraf';
import saveInlineQueries from '../bot/save-inline-queries';
import { TelegramBot } from '../bot/TelegramBot.meta';
import { TelegramSession } from '../Session.meta';
// import { serviceManager } from '../../../tree/services/server';
import { TelegramUser } from '../User.meta';
import { parseParams } from './parse-params';

export function createUpdate(cmd, tgUser, extra = {}) /*: TT.Update*/ {
  return {
    update_id: 0,
    message: {
      system: true,
      text: `/${cmd} `,
      date: Math.round(Date.now() / 1000),
      from: {
        id: tgUser.tid,
        is_bot: false,
        first_name: tgUser.firstName,
        username: tgUser.username,
        language_code: tgUser.lang,
      },
      chat: {
        id: tgUser.tid,
        first_name: tgUser.firstName,
        username: tgUser.username,
        type: 'private',
      },
      cmd: '',
      ...(cmd && {
        entities: [
          {
            offset: 0,
            length: cmd.length + 1,
            type: 'bot_command',
          },
        ],
      }),
      ...extra,
    },
  };
}

export function createTextUpdate(text, tgUser, extra) {
  let cmd = '';
  const match = text.match(/^\/(\w+)/);
  if (match) {
    cmd = match[1];
  }
  return createUpdate(cmd, tgUser, {
    text,
    cmd,
    ...extra,
  });
}

export function createUserContext(botNode, tid, { text = '', ...extra } = {}) {
  const botMeta = botNode.getMeta(TelegramBot);
  const botService = serviceManager.services[botMeta._id];
  if (!botService) {
    throw new Error('TG-SET-TIMER: bot service not found');
  }

  const userNode = botNode.findChild({ name: 'users' }).findChild({ name: `${tid}` });
  if (!userNode) {
    throw new Error(`TG-SET-TIMER: user not found: ${tid}`);
  }
  const tgUser = userNode.getMeta(TelegramUser);
  const tgSession = userNode.getMeta(TelegramSession);

  const update = createTextUpdate(text, tgUser, extra);

  // create context to run
  const telegraf = botService.bot;
  const tg = new Telegram(telegraf.token, telegraf.telegram.options);
  const ctx = new Context(update, tg, telegraf.options);

  Object.assign(ctx, telegraf.context);
  ctx.user = tgUser;
  ctx.session = ctx.bot.sessionMiddleware.getSession(ctx.from.id, ctx.chat.id);
  ctx.userNode = userNode;
  saveInlineQueries(ctx, () => {});
  parseParams(ctx);

  return ctx;
}
