import { TelegramAction } from '../TelegramAction.meta';
// import Link from '../../../../tree/ports/link.type';

export const TelegramActionPage = TelegramAction.inherit({
  name: 'tg.action.page',
  fields: {
    nodeId: {
      type: String,
    },
    // page: {
    //   type: Link,
    //   optional: true,
    // }
  },
});

export const TelegramActionActionPage = TelegramActionPage.inherit({
  name: 'tg.action.page.withAction',
  fields: {
    action: {
      type: TelegramAction,
      optional: true,
    },
  },
});

export const TelegramActionPageWithUser = TelegramActionPage.inherit({
  name: 'tg.action.page.user',
  fields: {
    nodeId: {
      type: String,
    },
    tidFrom: {
      type: String,
    },
    contextFrom: {
      type: String,
      optional: true,
    },
  },
});
