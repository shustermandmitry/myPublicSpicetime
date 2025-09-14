import { capitalize } from '@s-libs/micro-dash';
import { TelegramBot } from '../../bot/TelegramBot.meta';
import { TelegramMenuButton } from '../menu/TelegramActionMenu.meta';
import { TelegramActionMessage } from '../message/TelegramActionMessage.meta';
import TString from '../translate/TString';

export const TelegramActionSelectLanguage = TelegramActionMessage.inherit({
  name: 'tg.action.selectLanguage',
  fields: {},
});

const flags = {
  ru: '🇷🇺',
  en: '🇺🇸',
  es: '🇪🇸',
  cn: '🇨🇳',
  tr: '🇹🇷',
  de: '🇩🇪',
  uz: '🇺🇿',
};

if (globalThis.isServer) {
  TelegramActionSelectLanguage.extend({
    helpers: {
      run(ctx) {
        // don't show if language selected
        if (ctx.session.data.langSelected) return;

        this.rows = [
          {
            buttons: this.langs(ctx).map(
              (l, id) =>
                new TelegramMenuButton({
                  id,
                  title: TString.forAll(`${flags[l]} ${capitalize(l)}`),
                }),
            ),
          },
        ];
        // call super.run
        return this.__proto__.__proto__.run.call(this, ctx);
      },

      callback(ctx) {
        const [id, buttonId] = ctx.callbackQuery.data.split(',');
        ctx.editMessageReplyMarkup('');

        const curLang = ctx.user.lang;
        const lang = this.langs(ctx)[buttonId];

        ctx.session.data.langSelected = true;
        ctx.user.lang = lang;
        ctx.userNode.save();

        if (curLang !== lang) return ctx.callbacks.command(ctx, 'start');
      },

      langs(ctx) {
        return ctx.botNode.getMeta(TelegramBot).langs.split(',');
      },
    },
  });
}
