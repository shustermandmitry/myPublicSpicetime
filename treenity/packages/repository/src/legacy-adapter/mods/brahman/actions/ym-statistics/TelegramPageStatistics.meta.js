// import { Meteor } from '../../../../utils/meteor';
import { Class, Meta } from '../../../../tree';

const TelegramUserHistory = Class.create({
  name: 'tg.page.statistics.history',
  collection: null, //new Meteor.Collection('tg_page_statistics_history'),
  fields: {
    userId: {
      type: String,
      optional: false,
    },
    pages: {
      type: [String],
      default: () => [],
    },
  },
});

export const TelegramPageStatistics = Meta.inherit({
  name: 'tg.page.statistics',
  fields: {
    counterId: {
      type: Number,
      optional: false,
    },
  },
});

export default TelegramUserHistory;
