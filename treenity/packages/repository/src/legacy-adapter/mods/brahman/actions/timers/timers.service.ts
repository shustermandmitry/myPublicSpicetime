import { Meteor } from 'meteor/meteor';

import { addComponent, getTypeName } from '../../../../tree';
import { Tree } from '../../../../tree/base/tree';
import { BaseServiceComponent } from '../../../../tree/services/base-service.server';
import { warn } from '../../../../utils/log';

import TimersServiceMeta, { Timer } from './timers.service.meta';

export class TimersService extends BaseServiceComponent {
  timersNode: any;

  didInit() {
    super.didInit();

    const { meta } = this.props;
    const node = meta.node();
    const timersNode = (this.timersNode = node.ensureChild('timers'));

    let timeoutIndex;
    let fireAt = Number.MAX_VALUE;

    function fireTimer() {
      // current timer and next timer to fire
      const timerNodes: Array<any> = Tree.findCursorByMetaType(
        Timer,
        {},
        { fireAt: { $lte: new Date() } },
        { sort: { fireAt: 1 } },
      ).fetch();

      for (let i = 0; i < timerNodes.length; i++) {
        const timerNode = timerNodes[i];

        const timer = timerNode.getMeta(Timer);
        timerNode.remove();

        const actionMeta = Tree.getMetaById(timer.metaId);
        try {
          actionMeta[timer.method](timer.params);
        } catch (err) {
          warn('TIMER-SERVICE', err);
        }
      }

      // set next timer
      const [nextNode] = Tree.findCursorByMetaType(
        Timer,
        {},
        {},
        { limit: 1, sort: { fireAt: 1 } },
      ).fetch();

      if (nextNode) {
        const timer = nextNode.getMeta(Timer);
        setTimer(timer.fireAt);
      } else {
        cancelTimer();
      }
    }

    function setTimer(at) {
      cancelTimer();
      const now = Date.now();
      fireAt = at;
      timeoutIndex = Meteor.setTimeout(fireTimer, at - now);
    }
    function cancelTimer() {
      if (timeoutIndex) {
        Meteor.clearTimeout(timeoutIndex);
      }
      timeoutIndex = 0;
      fireAt = Number.MAX_VALUE;
    }

    // observe timers changes
    const cursor = timersNode.allChildrenCursor(
      { '_m._t': getTypeName(Timer) },
      { sort: { fireAt: 1 }, limit: 10 },
    );

    cursor.observe({
      added(timerNode) {
        const timer = timerNode.getMeta(Timer);
        if (timer.fireAt < fireAt) setTimer(timer.fireAt);
      },
      changed(newTimerNode) {
        const newTimer = newTimerNode.getMeta(Timer);
        if (newTimer.fireAt < fireAt) setTimer(newTimer.fireAt);
      },
      // removed() {
      // }
    });
  }

  public setTimer(name: string, metaId: string, method: string, params: object, fireAt: Date) {
    const node = this.timersNode.ensureChild(name);
    let meta = node.getMeta(Timer);
    if (!meta) {
      meta = node.addMeta(Timer);
    }

    meta.metaId = metaId;
    meta.method = method;
    meta.params = params;
    meta.fireAt = fireAt;
    meta.duration = +fireAt - Date.now();

    node.save();
  }

  public cancelTimer(name: string) {
    this.timersNode.findChild({ name })?.remove();
  }
}

addComponent(TimersService, TimersServiceMeta, 'service');
