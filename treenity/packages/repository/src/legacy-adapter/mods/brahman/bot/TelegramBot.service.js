import { logger } from '@/logger';
// import { BaseServiceComponent } from '../../../tree/services/base-service.server';
import { addComponent } from '../../../tree';
import { setupTelegramBot } from './setup-bot';
import { TelegramBot } from './TelegramBot.meta';
// import { NodeCol } from '../../../tree/base/node';

const { warn, info } = logger;

class TelegramBotService {
  getMeta = () => {
    return this.props.meta;
  };

  willUpdate(meta) {
    this.bot.context.botNode = meta.node();
  }

  async didInit({ node, meta }) {
    const botsDisabled = process.env.BOTS == 0;
    // dont init bots for local, it will be on server
    let token = undefined;
    if (botsDisabled) {
      token = Meteor.settings.bots[meta.token];
      if (!token) {
        warn('BOT', 'token replacement not found for', meta.alias);
        return;
      }
    }

    this.bot = await setupTelegramBot(meta, this.getMeta, token);

    const botInfo = await this.bot.telegram.getMe();

    info('BOT', 'bot started', botInfo);

    // dont save bot name if using local bots
    if (botsDisabled) return;

    meta.alias = `@${botInfo.username}`;
    meta.name = botInfo.first_name;

    meta.node().save();
  }

  didDestroy() {
    if (this.bot) {
      this.bot.stop();
    }

    delete this.bot;
  }
}

addComponent(TelegramBotService, TelegramBot, 'service');
