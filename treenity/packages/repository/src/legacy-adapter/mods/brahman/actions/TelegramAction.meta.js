import { Meta } from '../../../tree';

export const TelegramAction = Meta.inherit({
  name: 'tg.action',
  fields: {
    order: {
      type: Number,
      optional: true,
      form: {
        hide: true,
      },
    },
  },
});
