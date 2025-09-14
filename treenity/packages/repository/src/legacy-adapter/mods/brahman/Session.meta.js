import { Meta } from '../../tree';

export const TelegramSession = Meta.inherit({
  name: 'tg.session',
  fields: {
    tid: Number,
    data: {
      type: Object,
      optional: true,
    },
    history: {
      type: [String],
      default: () => [],
    },
    callbacks: {
      type: Object,
      default: () => ({}),
    },
    chats: Object,
  },
  behaviors: { timestamp: {} },
});
