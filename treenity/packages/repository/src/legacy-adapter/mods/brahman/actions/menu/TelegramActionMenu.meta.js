import { Class, Enum } from '../../../../tree';

import { TelegramAction } from '../TelegramAction.meta';
import TString from '../translate/TString';

export const TelegramMenuButton = Class.create({
  name: 'tg.action.menu.button',
  fields: {
    id: Number,
    // title: String,
    title: {
      type: TString,
      optional: true,
    },
    url: {
      type: String,
      optional: true,
    },
    tags: {
      type: [String],
      default: () => [],
    },
    action: {
      type: TelegramAction,
      optional: true,
    },
  },
  // helpers: {
  //   run(session) {
  //     if (this.pageId)
  //       this.page.run(session);
  //   }
  // }
});

export const TelegramMenuRow = Class.create({
  name: 'tg.action.menu.row',
  fields: {
    buttons: [TelegramMenuButton],
  },
  // helpers: {
  //   findButton(text) {
  //     return _.find(this.buttons, b => b.name.startsWith(text));
  //   }
  // }
});

const MenuType = Enum.create({
  name: 'tg.menu.type',
  identifiers: {
    NONE: 'none',
    INLINE: 'inline',
    INLINE_NEW: 'inlineNew',
    INLINE_CLOSE: 'inlineClose',
    KEYBOARD: 'keyboard',
    REMOVE: 'remove',
    FORCE_REPLY: 'forceReply',
  },
});

export const TelegramActionMenu = TelegramAction.inherit({
  name: 'tg.menu',
  fields: {
    menuType: {
      type: MenuType,
      default: MenuType.NONE,
    },

    rows: {
      type: [TelegramMenuRow],
      default() {
        return [];
      },
    },
  },
});
TelegramActionMenu.Type = MenuType;

// export const TelegramMenuCol = new Meteor.Collection('telegram_menu');
// export const TelegramMenu = TelegramMenuPage.inherit({
//   name: 'tg.menu',
//   collection: TelegramMenuCol,
// });
// TelegramMenu.findButton = function (menuId, text) {
//   const menu = this.findOne(menuId/*{ 'rows.buttons.name': new RegExp(`^${text}.*`) }*/);
//   return menu && menu.findButton(text);
// };
