import { warn } from '../../../../utils/log';
import StopProcess from '../../utils/stop-process';
import { TelegramActionIfElse } from './TelegramActionIfElse.meta';

TelegramActionIfElse.extend({
  helpers: {
    async run(ctx) {
      // nothing to do without it
      if (!this.actionIf && !this.actionElse) return;

      const condition = ctx.format(this.condition);
      try {
        const res = !!eval(condition);

        if (res) {
          if (this.actionIf) {
            await this.actionIf.run(ctx);

            if (this.stopAfterAction) throw new StopProcess();
          }
        } else {
          if (this.actionElse) {
            await this.actionElse.run(ctx);

            if (this.stopAfterAction) throw new StopProcess();
          }
        }
      } catch (err) {
        if (!(err instanceof StopProcess)) warn('TG-IFELSE', err.message);
        throw err;
      }
    },
  },
});
