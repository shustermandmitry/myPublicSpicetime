import { Meta } from '../../../../tree/base/meta';

export const TelegramCoursesOperator = Meta.inherit({
  name: 'tg.academy.operator',
  fields: {
    userId: {
      type: String,
      optional: false,
    },
    completed: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
});
