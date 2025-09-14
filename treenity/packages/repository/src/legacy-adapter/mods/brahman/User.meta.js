import { Meta } from '../../tree';

// export const TelegramUserState = Enum.create({
//   name: 'tg.user.state',
//   identifiers: {
//     STARTED: 'started',
//     STOPPED: 'stopped',
//     BLOCKED: 'blocked',
//   },
// });

export const TelegramUser = Meta.inherit({
  name: 'tg.user',
  fields: {
    tid: Number,
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    username: { type: String, optional: true },
    lang: { type: String, optional: true },
    isAdmin: { type: Boolean, optional: true },
    blocked: {
      // bot blocked by user
      type: Boolean,
      default: false,
    },
    banned: {
      // user banned by admins
      type: Boolean,
      default: false,
    },
  },
  behaviors: { timestamp: {} },
});

export const TelegramAdminUser = Meta.inherit({
  name: 'tg.user.admin',
  fields: {
    impersonateTid: { type: Number, optional: true },
  },
  behaviors: { timestamp: {} },
});
