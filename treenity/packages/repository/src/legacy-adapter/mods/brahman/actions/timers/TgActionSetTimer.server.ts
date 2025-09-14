import ms from 'ms';

import { serviceManager } from '../../../../tree/services/server';

import { createUserContext } from '../../utils/create-update';
import TgActionSetTimer, { TgActionCancelTimer } from './TgActionSetTimer.meta';
import { TimersService } from './timers.service';

import TimersServiceMeta from './timers.service.meta';

function getTimersService(node): TimersService | never {
  const timersServiceNode = node.findAllParents({ '_m._t': 'timers.service' })[0];
  const timersMeta = timersServiceNode.getMeta(TimersServiceMeta);
  const timersService: TimersService = serviceManager.services[timersMeta._id];

  if (!timersService) {
    throw new Error('TG-SET-TIMER: timers service not started');
  }

  return timersService;
}

TgActionSetTimer.extend({
  helpers: {
    run(ctx) {
      const timersService = getTimersService(this.node());

      const fireAt = new Date(Date.now() + ms(this.duration)); // get msec

      const timerName = `${this.name}_${ctx.tid}`;
      timersService.setTimer(timerName, this._id, 'fireTimer', { tid: ctx.tid }, fireAt);
    },

    fireTimer({ tid }) {
      const botNode = this.node().findAllParents({ '_m._t': 'tg.telegram' })[0];

      const ctx = createUserContext(botNode, tid);

      return this.action.run(ctx);
    },
  },
});

TgActionCancelTimer.extend({
  helpers: {
    run(ctx) {
      const timersService = getTimersService(this.node());

      const timerName = `${this.name}_${ctx.tid}`;
      timersService.cancelTimer(timerName);
    },
  },
});
