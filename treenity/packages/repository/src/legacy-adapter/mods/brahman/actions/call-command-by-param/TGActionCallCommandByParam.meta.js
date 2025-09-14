const {} = require('../../../../tree');

const { TelegramAction } = require('../TelegramAction.meta');

export const TelegramActionCallCommandByParam = TelegramAction.inherit({
  name: 'tg.callCommandOnParam',
  fields: {},
});

if (globalThis.isServer) {
  const StopProcess = require('../../utils/stop-process').default;

  TelegramActionCallCommandByParam.extend({
    helpers: {
      async run(ctx) {
        const param = ctx.session.param;
        if (param.startsWith('_')) {
          await ctx.callbacks.onlyCommand(ctx, param.slice(1));
          throw new StopProcess();
        }
      },
    },
  });
}
