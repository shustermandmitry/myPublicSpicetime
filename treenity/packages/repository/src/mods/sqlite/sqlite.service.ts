// import { TelegramServiceMeta, telegramServiceSchema } from './sqlite.meta';

// class TelegramService extends FeathersService<any> {
//   meta: TelegramServiceMeta;
//   node: Node;
//   tg: Telegraf = null!;
//
//   constructor({ meta, node }: ServiceConstructorParams<TelegramServiceMeta>) {
//     super();
//     this.meta = meta;
//     this.node = node;
//   }
//
//   async _setup(app: Application, path: string) {
//     this.tg = new Telegraf(this.meta.token);
//     this.tg.botInfo = await this.tg.telegram.getMe();
//     this.tg.launch();
//     console.log('setup', this.tg.botInfo);
//
//     this.tg.use(async (ctx, next) => {
//       console.log('Update', ctx.update);
//       return next();
//     });
//   }
//
//   async teardown() {
//     this.tg.stop();
//   }
//
//   async find(params: any) {
//     return [this.tg.botInfo as any];
//   }
//   async get(id: string, params: any) {
//     return { botInfo: this.tg.botInfo } as any;
//   }
//   async create({ id, text }: { id: string; text: string }) {
//     await this.tg.telegram.sendMessage(id, text);
//   }
// }
//
// types.schema.add('test.telegram', telegramServiceSchema, {});
// feathers.add('test.telegram', TelegramService);

// export default TelegramService;
