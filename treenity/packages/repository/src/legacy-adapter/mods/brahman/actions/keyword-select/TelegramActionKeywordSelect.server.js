import splitFirst from '../../../../utils/split-first';
import { createUserContext } from '../../utils/create-update';
import { TelegramActionKeywordSelect } from './TelegramActionKeywordSelect.meta';

TelegramActionKeywordSelect.extend({
  helpers: {
    async run(ctx) {
      const text = ctx.format(this.textFrom);
      const words = text
        .toLowerCase()
        .split(/[^#\w\-А-я]/) // split in words
        .filter(w => w.length > 2);

      // find element to answer
      const element = this.elements.find(e => {
        return e.keywords.find(kw => kw.split(' ').every(k => words.includes(k)));
      });
      if (!element) return;
      // const found = !!this.elements.keywords.find(k => words.includes(k));
      // if (!found) return;

      if (element.message.startsWith('/')) {
        let [command, text] = splitFirst(element.message, '\n');
        text = text.trim();
        // run as system command
        const context = createUserContext(ctx.botNode, ctx.from.id, {
          original: ctx.message,
          text: command,
          chat: ctx.chat,
        });
        await ctx.callbacks.message(context);
        if (text) await ctx.reply(text);
      } else {
        return ctx.reply(element.message);
      }
    },
  },
});
