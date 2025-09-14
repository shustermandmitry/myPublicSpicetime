import { TelegramAction } from '../../TelegramAction.meta';

export const VoiceRecognition = TelegramAction.inherit({
  name: 'tg.action.voice.tinkoff',
  fields: {
    apiKey: {
      // tinkoff voice kit key
      type: String,
    },
    apiSecret: {
      // tinkoff voice kit key
      type: String,
    },
    saveTo: {
      type: String,
      default: 'voiceText',
    },
  },
});
