import { FeathersService } from '@/utils/feathers-setup-service';
import { Application } from '@feathersjs/feathers';
import { Node, types } from '@treenity/core';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { Telegraf } from 'telegraf';
import { MessagesServiceMeta, messagesServiceSchema } from './messages.meta';

class TelegramService extends FeathersService<any> {
  meta: MessagesServiceMeta;
  node: Node;
  tg: Telegraf = null!;

  constructor({ meta, node }: ServiceConstructorParams<MessagesServiceMeta>) {
    super();
    this.meta = meta;
    this.node = node;
  }

  async _setup(app: Application, path: string) {}

  async teardown() {}

  async find(params: any) {
    return [this.tg.botInfo as any];
  }

  async get(id: string, params: any) {
    return { botInfo: this.tg.botInfo } as any;
  }

  async create({ id, text }: { id: string; text: string }) {
    await this.tg.telegram.sendMessage(id, text);
  }
}

types.schema.add('test.telegram', messagesServiceSchema, {});
feathersContext.add('test.telegram', TelegramService);

export default TelegramService;
