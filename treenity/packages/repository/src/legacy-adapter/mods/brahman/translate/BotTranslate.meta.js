import { Meta } from '../../../tree';

export const BotTranslate = Meta.inherit({
  name: 'tg.bot.translate',
  fields: {
    lang: {
      type: String,
    },
  },
  metaMethods: {
    saveTranslation() {},
  },
});
