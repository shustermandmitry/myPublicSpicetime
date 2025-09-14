import { TelegramAction } from '../../TelegramAction.meta';

export const VoiceRecognition = TelegramAction.inherit({
  name: 'tg.action.voice.recignition',
  fields: {
    asrKey: {
      // yandex asr key
      type: String,
    },
    saveTo: {
      type: String,
    },
  },
});
