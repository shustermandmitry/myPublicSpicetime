import { logger } from '@/logger';
import SocksAgent from 'socks-proxy-agent';
import Telegraf from 'telegraf';

// import { createCachedTracker } from '../../../utils/tracker-updater';
// import { NamedNode } from '../../types/named-node/NamedNode.meta';
import { TelegrafTreenitySession } from '../TelegrafTreenitySession';
import { checkAuth } from '../utils/check-auth';
import { parseParams } from '../utils/parse-params';
import StopProcess from '../utils/stop-process';
import callbacks from './callbacks';
import saveInlineQueries from './save-inline-queries';
import saveMessages from './save-messages';

const { warn } = logger;

// ctx.setCallback(this, this.type);
function catchErrors(ctx, next) {
  return next().catch(err => {
    if (err instanceof StopProcess) return;
    warn('TG-CALLBACK', ctx.tid, err);

    if (err.message === '403: Forbidden: bot was blocked by the user') {
      warn('TG-CALLBACKS', 'removing', ctx.tid);
      ctx.user.blocked = true;
      ctx.userNode.save();
      return;
    } else {
      if (ctx.user.isAdmin) ctx.reply(`Error: ${err.message}`).catch(console.error);
    }
  });
}

export async function setupTelegramBot(botMeta, getBotMeta, botToken) {
  const token = botToken || botMeta.token;
  const proxy = botMeta.proxy;

  const options = {
    handlerTimeout: 1,
  };
  if (proxy) {
    options.telegram = {
      agent: new SocksAgent(proxy),
    };
  }
  const bot = new Telegraf(token, options);

  const botNode = botMeta.node();

  // create pages page
  botNode.ensureChild('users');
  botNode.ensureChild('pages');
  const filesNode = botNode.ensureChild('files');

  // set context
  Object.assign(bot.context, callbacks.context({ botNode, getBotMeta, botMeta, bot, filesNode }));
  // autoupdate bot node
  // TODO
  // createCachedTracker(
  //   () => NamedNode.find(botNode._id, { limit: 1 }),
  //   botNodes => {
  //     bot.context.botNode = botNodes[0];
  //   },
  // );

  bot.use(catchErrors);
  bot.use(saveMessages);
  bot.use(saveInlineQueries);
  TelegrafTreenitySession.setup(bot, botNode);
  bot.use(checkAuth);
  bot.use(parseParams);

  // bot.start(checkAuth);
  bot.on('message', callbacks.message);

  bot.on('callback_query', callbacks.callbackQuery);

  await bot.launch();

  return bot;
}
