import { Application } from '@feathersjs/feathers';
import { Node } from '@treenity/core';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { Telegraf } from 'telegraf';
import { TelegramServiceMeta, telegramServiceSchema } from './telegram.meta';
import { TreenityService } from '@treenity/feathers-service';

class TelegramService extends TreenityService<any> {
  meta: TelegramServiceMeta;
  node: Node;
  tg: Telegraf = null!;

  constructor({ meta, node }: ServiceConstructorParams<TelegramServiceMeta>) {
    super();
    this.meta = meta;
    this.node = node;
  }

  async _setup(app: Application, path: string) {
    const config = app.get('authentication');
    this.tg = new Telegraf(config.telegram.token);
    this.tg.botInfo = await this.tg.telegram.getMe();
    this.tg.launch();
  }

  async find(params: any) {
    return [this.tg.botInfo as any];
  }

  async get(id: string, params: any) {
    return { botInfo: this.tg.botInfo } as any;
  }

  async sendMessage({ id, text, extra }: { id: string; text: string; extra: any }) {
    await this.tg.telegram.sendMessage(id, text, extra);
  }

  async teardown() {
    this.tg.stop();
  }
}

feathersContext.add('sys.telegram', TelegramService);
// types.schema.add('sys.telegram', telegramServiceSchema, {});

export default TelegramService;
