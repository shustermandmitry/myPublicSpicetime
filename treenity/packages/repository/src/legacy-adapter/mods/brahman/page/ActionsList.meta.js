import { Meta } from '../../../tree';

export const TgActionList = Meta.inherit({
  name: 'tg.actionList',
  fields: {
    positions: {
      type: [String],
      optional: true,
      form: {
        hide: true,
      },
    },
    actions: {
      type: [TelegramAction],
      default: () => [],
    },
    // actions: actionsField,
  },
});
