import { find, intersection, last } from '@s-libs/micro-dash';
import findMap from '../../../../utils/find-map';
import { forceReply, inlineKeyboard, keyboard, remove } from '../../keyboard';
import renderTemplate from '../render-template';

import { TelegramActionMenu } from './TelegramActionMenu.meta';

const T = TelegramActionMenu.Type;

function checkTags(userTags, buttonTags) {
  const plusTags = buttonTags.filter(t => t[0] !== '!');
  if (
    (plusTags.length && !intersection(userTags, plusTags).length) ||
    (buttonTags.length &&
      intersection(
        userTags.map(t => `!${t}`),
        buttonTags,
      ).length)
  ) {
    return false;
  }
  return true;
}

TelegramActionMenu.extend({
  helpers: {
    runMenu(ctx) {
      if (
        this.menuType === TelegramActionMenu.Type.KEYBOARD &&
        last(ctx.session.history) !== this.node()._id
      ) {
        ctx.session.history.push(this.node()._id);
      }
    },

    callback(ctx) {
      let button = undefined;

      if (ctx.message) {
        const title = ctx.message.text;
        button = this.getButton({ title });
      } else if (ctx.callbackQuery) {
        const [id, buttonId] = ctx.callbackQuery.data.split(',');
        button = this.getCallbackButton(ctx, { id: parseInt(buttonId) });
        if (this.menuType === TelegramActionMenu.Type.INLINE_CLOSE) {
          ctx.editMessageReplyMarkup('');
        }
      }

      if (!button || !button.action) {
        return false;
      }

      return button.action.run(ctx);
    },

    keyboard(ctx, { tags, callbackData } = {}) {
      return this.makeKeyboard(ctx, {
        menuType: this.menuType,
        rows: this.rows,
        tags,
        callbackData,
      });
    },

    makeRows(rows, tags, onButton) {
      return rows.map(r =>
        r.buttons
          .map(b => {
            if (!checkTags(tags, b.tags)) return false;

            return onButton(b);
          })
          .filter(Boolean),
      );
    },

    makeKeyboard(ctx, { menuType, rows, tags, callbackData } = {}) {
      switch (menuType) {
        case T.INLINE_CLOSE:
        case T.INLINE_NEW:
        case T.INLINE: {
          const inlineId = ctx.newId();
          ctx.queries[inlineId] = { action: this._id };

          const inlineRows = this.makeRows(rows, tags, b => {
            const ret = {
              text: ctx.format(b.title),
            };
            if (!ret.text) return undefined;
            if (b.url) {
              ret.url = renderTemplate(b.url, ctx.session);
            } else if (b.switch) {
              ret.switch_inline_query = b.switch;
            } else if (callbackData) {
              ret.callback_data = `${inlineId},${b.id},${callbackData}`;
            } else {
              ret.callback_data = `${inlineId},${b.id}`;
            }
            return ret;
          });
          return inlineKeyboard(inlineRows);
        }
        case T.KEYBOARD: {
          const kbRows = this.makeRows(rows, tags, b => ({ text: ctx.format(b.title) }));

          return keyboard(kbRows);
        }
        case T.REMOVE: {
          return remove();
        }
        case T.FORCE_REPLY: {
          return forceReply();
        }
        default:
          return {};
      }
    },
    // async saveMessageId(ctx, promise) {
    //   const result = await promise;
    //   if (menuType === T.INLINE || menuType === T.INLINE_CLOSE) {
    //     const { queries } = ctx.session.data;
    //     queries[inlineId].messageId = result.message_id;
    //   }
    // },
    getButton(s) {
      const a = findMap(this.rows, r => find(r.buttons, b => b.title.includes(s.title)));
      return a;
    },
    getCallbackButton(ctx, s) {
      const a = findMap(this.rows, r => find(r.buttons, b => b.id === s.id));
      return a;
    },
  },
});
