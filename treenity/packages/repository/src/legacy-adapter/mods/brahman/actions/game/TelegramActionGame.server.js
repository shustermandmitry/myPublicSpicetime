import { last } from '@s-libs/micro-dash';
import { inlineKeyboard } from '../../keyboard';
import renderTemplate from '../render-template';
import { Button, Data, Game } from './Game.meta';
import { TelegramActionGame } from './TelegramActionGame.meta';

TelegramActionGame.extend({
  helpers: {
    run(ctx) {
      this.sendToAll(ctx);

      // const gameMeta = this.ensureGameMeta(ctx);
      // const data = new Data({ buttons: [] });
      //
      // this.rows.forEach(r => {
      //   r.buttons.forEach(b => {
      //     data.buttons.push(new Button({ id: b.id, name: b.title, isPushed: false }));
      //   });
      // });
      //
      //
      // gameMeta.data.push(data);
      // gameMeta.node()
      //   .save();
      //
      // return ctx.replyWithHTML(renderTemplate(this.message, ctx.session), this.keyboard());
    },
    ensureGameMeta(ctx) {
      const userNode = ctx.botNode.findChildDeep({ name: `${ctx.from.id}` });

      let gameMeta = userNode.getMetaByField({ menuId: this._id });

      if (!gameMeta) {
        gameMeta = userNode.addMeta(Game, {
          menuId: this._id,
          data: [],
        });
        userNode.save();
      }
      return gameMeta;
    },

    keyboard(buttons) {
      const rows = this.rows.map(r =>
        r.buttons.map(b => {
          let ret;

          if (buttons) {
            const { isPushed } = buttons.find(b1 => parseInt(b1.id) === b.id);
            ret = {
              text: isPushed ? `${b.title}${this.defaultSymbol}` : b.title,
            };
          } else {
            ret = {
              text: b.title,
            };
          }
          if (b.url) {
            ret.url = b.url;
          } else if (b.switch) {
            ret.switch_inline_query = b.switch;
          } else {
            ret.callback_data = `${this._id},${b.id}`;
          }
          return ret;
        }),
      );
      return inlineKeyboard(rows);
    },

    callback(ctx) {
      const gameMeta = this.ensureGameMeta(ctx);
      const id = parseInt(ctx.callbackQuery.data.split(',')[2]);

      const button = last(gameMeta.data).buttons.find(b => b.id === id);
      button.isPushed = !button.isPushed;

      const keyboard = this.keyboard(last(gameMeta.data).buttons);
      ctx.editMessageText(renderTemplate(this.message, ctx.session), keyboard);

      gameMeta.node().save();
    },

    currentRound(ctx) {
      const gameMeta = this.ensureGameMeta(ctx);

      const lastGame = last(gameMeta.data);
      if (!lastGame) {
        return ctx.reply("You didn't start any game");
      }

      const keyboard = this.keyboard(lastGame.buttons);

      ctx.replyWithHTML(renderTemplate(this.message, ctx.session), keyboard);
    },

    sendToAll(ctx) {
      const usersNode = ctx.botNode.findChild({ name: 'users' });
      const allUsers = usersNode.getChildren();

      allUsers.forEach(userNode => {
        const gameMeta = this.ensureGameMeta({
          botNode: ctx.botNode,
          from: { id: parseInt(userNode.name) },
        });
        const data = new Data({ buttons: [] });
        this.rows.forEach(r => {
          r.buttons.forEach(b => {
            data.buttons.push(new Button({ id: b.id, name: b.title, isPushed: false }));
          });
        });
        gameMeta.data.push(data);
        gameMeta.node().save();
        return ctx.telegram.sendMessage(
          userNode.name,
          renderTemplate(this.message, ctx.session),
          this.keyboard(),
        );
      });
    },
  },
});
