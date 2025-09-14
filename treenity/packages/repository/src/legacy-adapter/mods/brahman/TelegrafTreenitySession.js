import { get, set } from '@s-libs/micro-dash';
import assert from '../../utils/assert';

import { atob } from '../../utils/base64';
// import { NamedNode } from '../types/named-node/NamedNode.meta';
import { TelegramSession } from './Session.meta';

export class TelegrafTreenitySession {
  sessions = {};

  constructor(node, options) {
    this.options = Object.assign(
      {
        sessionName: 'session',
      },
      options,
    );

    this.usersNode = node.findChild({ name: 'users' });
    assert(this.usersNode, 'user node not found');
  }

  ensureMeta(tid) {
    const node = this.usersNode.ensureChild(`${tid}`);
    const meta =
      node.getMeta(TelegramSession) ||
      node.addMeta(TelegramSession, {
        tid,
        data: {},
        chats: {},
        history: [],
      });
    node.save();
    return [meta, node];
  }

  async saveSession(tid, cid, session) {
    const { node } = session;
    // XXX - need to sync, so that session data not owerride user
    const userNode = null;
    // const userNode = NamedNode.findOne(node._id);
    const meta = userNode.getMeta(TelegramSession) || session.meta;

    if (session.chat) {
      meta.chats[cid] = session.chat;
    }
    meta.data = session.data;
    meta.history = session.history;
    meta.callbacks = session.callbacks;
    userNode.save();
  }

  getSession(tid, cid) {
    const self = this;

    let session = this.sessions[tid];
    if (!session) {
      const [meta, node] = this.ensureMeta(tid);
      this.sessions[tid] = session = {
        meta,
        node,
        data: meta.data,
        history: meta.history,
        chats: meta.chats,
        callbacks: meta.callbacks,
        set(name, value) {
          set(this.data, name, value);
          return this;
        },
        get(name) {
          return get(this.data, name);
        },
        save() {
          self.saveSession(tid, cid, this);
        },
        atob: () => (val, render) => {
          return atob(render(val));
        },
      };
    }

    session.chat = session.chats[cid] || {};

    return session;
  }

  middleware = async (ctx, next) => {
    if (!ctx.chat || !ctx.from) {
      return next();
    }

    const id = ctx.from.id;
    ctx.tid = id;

    const session = this.getSession(id);
    ctx[this.options.sessionName] = session;
    ctx.userNode = null; //XXX NamedNode.findOne(session.node._id);

    ctx.usersNode = this.usersNode;
    // let adminMeta = ctx.userNode.getMeta(TelegramAdminUser);
    // if (adminMeta) {
    //   const id = adminMeta.impersonateTid
    //   if (id) {
    //     const sesssion = await this.getSession(id);
    //     ctx.userNode =
    //   }
    // }

    await next();
    await this.saveSession(id, ctx.chat.id, ctx[this.options.sessionName] || {});
  };

  static setup(bot, node, params = {}) {
    const session = new TelegrafTreenitySession(node, params);

    bot.sessionMiddleware = session;
    bot.use(session.middleware);
  }
}
