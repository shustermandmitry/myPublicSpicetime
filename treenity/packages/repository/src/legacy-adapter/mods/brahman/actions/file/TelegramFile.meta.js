import { Meta } from '../../../../tree';

export const TelegramFile = Meta.inherit({
  name: 'tg.file',
  fields: {
    file: {
      type: Object,
      optional: true,
    },
    fileLink: {
      type: String,
      optional: true,
    },
    caption: {
      type: String,
      optional: true,
    },
    uniqId: {
      type: String,
      optional: true,
    },
  },
});
