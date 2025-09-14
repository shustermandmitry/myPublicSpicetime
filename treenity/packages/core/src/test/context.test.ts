import type { FromSchema } from 'json-schema-to-ts';
import { Meta } from '../meta';
import { metaType } from '../meta-type';
import { Node } from '../node';
import { types } from '../types';

describe('context', () => {
  test('schema and service', async function () {
    const TelegramBotSchema = {
      type: 'object',
      properties: {
        token: { type: 'string' },
        chatId: { type: 'string' },
      },
      required: ['token', 'chatId'],
    } as const;
    type TelegramBot = FromSchema<typeof TelegramBotSchema>;

    const TelegramBotType = metaType<TelegramBot>('com.telegram.bot');

    // types.schema.add('com.telegram.bot', TelegramBotSchema, {});
    const TelegramService = {
      async setup(params: { meta: Meta<TelegramBot>; node: Node }): Promise<void> {},
    };
    types.jsSrv.add('com.telegram.bot', TelegramService, {});

    // const [schema, opts] = await types.schema.get(TelegramBotType);
    const [service, svcOpts] = await types.jsSrv.get(TelegramBotType);

    // expect(schema).toEqual(TelegramBotSchema);
    expect(service).toEqual(TelegramService);

    // const [tree] = await types.proto.get('tree');
    //
    // const root = (await tree.fetch('tree:/autorun')) as Node;
    // for (let meta of Object.values(root.metas)) {
    //   const [svc, opts] = await types.jsSrv.get(meta.$type);
    //   await svc.setup({ meta, node: root });
    // }
  });
});
