// import Web3 from 'web3';
// import { set } from '@s-libs/micro-dash';
// import { get } from '@s-libs/micro-dash';

// import { Random } from '../../../../utils/random';

import { logger } from '@/logger';
import { promised } from '@treenity/js-shared/utils';
import renderTemplate from '../actions/render-template';
// import { check, Match } from 'meteor/check';
import { TelegramAction } from '../actions/TelegramAction.meta';
// import { Wallets } from '../../io/collections/Wallets';
// import { IoUsers } from '../../io/collections/IoUsers';
// import { Web3Meta } from '../../web3/Web3.meta';
import { BotPage } from '../page/Page.meta';

import { downloadFile } from '../utils/download-file';
import StopProcess from '../utils/stop-process';
import { TelegramBot } from './TelegramBot.meta';

const { warn, error } = logger;

class Callbacks {
  message = async (ctx, next) => {
    return this.messageTry(ctx, next).catch(err => error('BOT-message', err));
  };

  messageTry = async (ctx, next) => {
    // check maintenance
    const maintenance = ctx.format(ctx.getBotMeta().maintenance);
    if (maintenance.trim() && !ctx.message.system) {
      return ctx.replyWithHTML(maintenance);
    }

    // check forward
    // if (ctx.message.forward_date) {
    //   return this.command(ctx, 'forward');
    // }

    const subType = ctx.updateSubTypes[0];

    ctx.session.lastMessageId = ctx.message.message_id;

    const method = this[subType] || this.unknown;
    return this.runMethod(ctx, async () => {
      const result = await method.call(this, ctx, next);
      if (!result) return this.runCallback(ctx);
    });
  };

  async runMethod(ctx, func) {
    try {
      return await func();
    } catch (err) {
      if (err instanceof StopProcess) return;

      warn('TG-CALLBACKS', ctx.tid, err.stack);
      if (err.message === '403: Forbidden: bot was blocked by the user') {
        warn('TG-CALLBACKS', 'removing', ctx.tid);
        ctx.user.blocked = true;
        ctx.userNode.save();
        return;
      } else {
        if (ctx.user.isAdmin) ctx.reply(`Error: ${err.message}`).catch(console.error);
      }
      ctx.session.error = err;
      try {
        return this.command(ctx, 'error');
      } catch (err2) {
        error('TG-CALLBACKS', ctx.tid, err2.stack);
      }
    }
  }

  async runCallback(ctx) {
    const subType = ctx.updateSubTypes[0];
    const actionId = ctx.session.callbacks[subType];
    if (actionId) {
      let result = undefined;
      if (typeof actionId === 'function') {
        result = await actionId(ctx);
      } else {
        const action = ctx.botNode.findChildDeepMetaId(actionId);
        result = () => action.callback(ctx);
      }
      if (result !== false) {
        delete ctx.session.callbacks[subType];
        return null;
      }
      return true;
    }
  }

  async text(ctx, next) {
    if (ctx.cmd) {
      return this.command(ctx);
    } else {
      const isButton = this.button(ctx);
      if (isButton === false) {
        return (await this.runCallback(ctx)) || this.command(ctx, 'global');
      } else {
        return isButton;
      }
    }
  }

  async command(ctx, cmd) {
    // this only for direct(not group chat) messages
    if (!(await this.onlyCommand(ctx, cmd)) && cmd !== 'start' && ctx.from.id === ctx.chat.id) {
      await this.command(ctx, 'start');
    }
  }

  async onlyCommand(ctx, cmd) {
    const pageNode = ctx.botNode.findChildDeep({ '_m.command': cmd || ctx.cmd });

    if (!pageNode) return false;

    await pageNode.getMeta(BotPage).run(ctx);
    return true;
  }

  button(ctx) {
    if (ctx.session.history.length === 0) {
      return false;
    }

    const nodeId = ctx.session.history[ctx.session.history.length - 1];
    const pageNode = ctx.botNode.findChildDeep({ _id: nodeId });

    // something changed and no more node from history exists
    if (!pageNode) {
      ctx.session.history = [];
      return false;
    }
    return pageNode.getMeta(BotPage).callback(ctx);
  }

  callbackQuery = ctx => {
    const parts = ctx.callbackQuery.data.split(':');
    const data = parts[0].split(',');
    const query = ctx.queries[data[0]];
    const node = ctx.botNode.findChildDeep({ '_m._id': query.action });
    const menu = node.getMetaById(query.action);

    return this.runMethod(ctx, () => menu.callback(ctx));
    // ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  };

  async unknown(ctx) {
    if (!(await this.onlyCommand(ctx, ctx.updateSubTypes[0]))) {
      console.warn('unknown telegram type received', ctx.updateSubTypes[0]);
    }
  }

  context(ctx) {
    const langs = ctx.botNode.getMeta(TelegramBot).langs.split(',');

    function setCallback(messageSubType, action) {
      check(action, Match.instanceOf(TelegramAction));
      check(messageSubType, String);
      check(action.callback, Function);

      this.session.callbacks[messageSubType] = action._id;
    }

    function setCallbackX(messageSubType, callback) {
      check(callback, Function);
      check(messageSubType, String);

      // XXX
      // this.callbacks[`${this.userNode._id}_${messageSubType}`] = callback;
      this.session.callbacks[messageSubType] = callback;
    }

    const MIN = 60 * 1000;

    function wait(messageSubType, timeout = 60 * MIN) {
      const prom = promised();
      // make timeout, and reject promise if any
      Meteor.setTimeout(() => {
        const promise = this.session.callbacks[messageSubType];
        if (promise) {
          delete this.session.callbacks[messageSubType];
          promise.reject(new Error('timeout'));
        }
      }, timeout);
      // this.session.callbacks[this.userNode._id] = prom;
      this.setCallbackX(messageSubType, val => prom.resolve(val));
      return prom;
    }

    function newId() {
      return Random.id();
    }

    function getWallet() {
      return Wallets.findOne({ tid: this.from.id });
    }

    // function getIOUser(tid) {
    //   return IoUsers.findOne({ tid: tid || this.from.id });
    // }
    // function getWeb3() {
    //   return new Web3(this.botNode.getMeta(Web3Meta).url);
    // }

    function getLang() {
      return langs.includes(this.user.lang) ? this.user.lang : langs[0];
    }

    function usersByTid(tid) {
      const node = this.botNode.findChildDeep({ _m: { $elemMatch: { _t: 'tg.user', tid } } });
      return node && node.getMeta('tg.user');
    }

    function formatLang(str, data) {
      if (typeof str !== 'object') {
        warn('I18N', 'untranslated string:', str);
      }
      return format(str, data);
    }

    function format(str, data) {
      data = {
        ctx: this,
        user: this.user,
        ...this.session,
        ...data,
      };

      if (typeof str === 'object') {
        return str.format(this.getLang(), data);
      } else if (typeof str === 'string') {
        return renderTemplate(str, data);
      } else {
        warn('I18N', 'unknown string format', str);
        return '';
      }
    }

    function setSession(path, value) {
      set(this.session, path, value);
    }

    function getSession(path) {
      return get(this.session, path);
    }

    return {
      callbacks: this,
      downloadFile,
      setCallback,
      setCallbackX,
      wait,
      newId,
      usersByTid,
      getWallet,
      // getIOUser,
      // getWeb3,
      getLang,
      format,
      formatLang,
      set: setSession,
      get: getSession,
      ...ctx,
    };
  }
}

const callbacks = new Callbacks();

export default callbacks;
