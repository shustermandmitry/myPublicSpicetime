import { TelegramAction } from '../TelegramAction.meta';

const TgActionSetTimer = TelegramAction.inherit({
  name: 'tg.actions.setTimer',
  fields: {
    name: {
      type: String,
    },
    duration: {
      type: String, // parsed by ms, so could be: 1s, 2m, 3h, 4d and others: https://github.com/vercel/ms
      form: {
        attrs: {
          placeholder: 'Like: 1s, 2m, 3h, 4d',
        },
      },
    },
    action: {
      type: TelegramAction,
      optional: true,
    },
  },
});

export default TgActionSetTimer;

export const TgActionCancelTimer = TelegramAction.inherit({
  name: 'tg.actions.cancelTimer',
  fields: {
    name: {
      type: String,
    },
  },
});
