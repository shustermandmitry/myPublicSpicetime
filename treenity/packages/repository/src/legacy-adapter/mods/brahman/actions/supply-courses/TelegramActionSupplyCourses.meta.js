import { Class } from '../../../../tree';
// import { Meteor } from '../../../../utils/meteor';
import { TelegramAction } from '../TelegramAction.meta';

const TelegramActionCoursesOrders = Class.create({
  name: 'tg.academy.course.order',
  collection: null, // new Meteor.Collection('tg_academy_course_order'),
  fields: {
    chatId: {
      type: String,
      optional: false,
    },
    alias: {
      type: String,
      optional: false,
    },
    number: {
      type: Number,
      optional: false,
    },
    state: {
      type: String,
      optional: false,
    },
    firstMessageId: {
      type: String,
      optional: false,
    },
    operatorsChatFirstMessageId: {
      type: String,
      optional: true,
    },
    operatorFirstMessageId: {
      type: String,
      optional: true,
    },
    forwardMessageId: {
      type: Number,
      optional: true,
    },
    operatorId: {
      type: Number,
      optional: true,
    },
    wasSkipped: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
    startedAt: {
      type: Date,
      optional: true,
    },
    duration: {
      type: Number,
      optional: true,
    },
    operatorNumber: {
      type: Number,
      optional: true,
    },
  },
});

export const TelegramActionSupplyCourses = TelegramAction.inherit({
  name: 'tg.action.academy.courses.create',
  fields: {
    chatId: {
      type: String,
      default: '',
    },
    timeForAccept: {
      type: Number,
      default: 120,
    },
    actionUserEnd: {
      type: TelegramAction,
      optional: true,
    },
    actionOperatorEnd: {
      type: TelegramAction,
      optional: true,
    },
    coursePrice: {
      type: Number,
      default: '',
    },
  },
});

export default TelegramActionCoursesOrders;
