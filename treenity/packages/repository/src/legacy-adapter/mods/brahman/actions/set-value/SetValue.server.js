import { TelegramActionEval, TelegramActionSetValue } from './SetValue.meta';

TelegramActionSetValue.extend({
  helpers: {
    run(ctx) {
      const value = eval(this.value);
      let result = typeof value === 'function' ? value() : value;
      ctx.set(this.saveTo, result);
      ctx.userNode.save();
    },
  },
});

TelegramActionEval.extend({
  helpers: {
    async run(ctx) {
      const value = eval(`async function f() { ${this.value} }; f;`);
      const result = await value();
    },
  },
});
