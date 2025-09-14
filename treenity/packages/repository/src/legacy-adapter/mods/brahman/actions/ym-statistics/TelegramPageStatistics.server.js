import dayjs from 'dayjs';
import fetch from 'node-fetch';
import { makeQueryString } from '../../../../utils/make-query-string';
import { Random } from '../../../../utils/random';
import TelegramUserHistory, { TelegramPageStatistics } from './TelegramPageStatistics.meta';

function hitYandexMetrikaCounter(counterId, visitParams, pageUrl, referer) {
  const qs = {
    rn: Random.id(10),
    wmode: 2,
    'page-url': pageUrl,
    'site-info': visitParams,
    'page-ref': referer,
    'browser-info': `:treenity`,
  };
  fetch(`https://mc.yandex.ru:443/watch/${counterId}/1${makeQueryString(qs)}`, {
    method: 'GET',
    headers: {
      'x-real-ip': '::1',
      'user-agent': referer,
    },
  });
}

TelegramPageStatistics.extend({
  helpers: {
    updateUserHistory(userHistory, cmd, userId) {
      if (!!userHistory) {
        cmd && userHistory.pages.push(`${cmd}`);
        userHistory.save();
      } else {
        let newUserHistory = new TelegramUserHistory({
          userId: userId,
          pages: [`${cmd}`],
        });
        newUserHistory.save();
      }
    },

    getVisitInfo(ctx) {
      const userId = ctx.user.tid.toString();
      const userHistory = TelegramUserHistory.findOne({ userId: userId });
      const cmd = ctx.cmd;
      const itsKeyboardPress = !cmd && ctx.update.message;
      const { message, callback_query: cq } = ctx.update;

      const pressedButtonText =
        !cmd && !itsKeyboardPress
          ? cq.message.reply_markup.inline_keyboard
              .find(element => {
                return element.some(e => e.callback_data === cq.data);
              })
              .find(element => {
                return element.callback_data === cq.data;
              }).text
          : message.text;

      const visitInfo = {
        visitParams: userHistory
          ? JSON.stringify({
              [`${ctx.user.username} ${userId}`]: {
                [dayjs(new Date()).format('DD.MM.YYYY')]: {
                  actions: cmd
                    ? `move from ${userHistory.pages[userHistory.pages.length - 1]} to ${cmd}`
                    : `press '${pressedButtonText}' button`,
                },
              },
            })
          : null,
        pageUrl: `${cmd || `press ${pressedButtonText} button`}`,
        referer: userId,
      };

      this.updateUserHistory(userHistory, cmd, userId);

      return visitInfo;
    },

    run(ctx) {
      const info = this.getVisitInfo(ctx);

      hitYandexMetrikaCounter(this.counterId, info.visitParams, info.pageUrl, info.referer);
    },
  },
});
