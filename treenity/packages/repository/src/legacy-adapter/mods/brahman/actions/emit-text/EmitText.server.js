import { createTextUpdate } from '../../utils/create-update';
import { EmitText } from './EmitText.meta';

EmitText.extend({
  helpers: {
    run(ctx) {
      const text = ctx.format(this.from);

      const update = createTextUpdate(text, ctx.user);
      return ctx.bot.handleUpdate(update);
    },
  },
});
