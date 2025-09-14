import { Enum } from '../../../../../tree';
import { TelegramAction } from '../../TelegramAction.meta';

export const YandexVoiceType = Enum.create({
  name: 'yandex.tts.voice',
  identifiers: {
    ALENA: 'alena',
    FILIPP: 'filipp',
  },
});

export const VoiceSynthesis = TelegramAction.inherit({
  name: 'tg.action.voice.yandex.tts',
  fields: {
    folderId: {
      // tinkoff voice kit key
      type: String,
    },
    oAuth: {
      // tinkoff voice kit key
      type: String,
    },
    textFrom: {
      type: String,
      default: '{{data.text}}',
    },
    path: {
      type: String,
      default: '/tmp',
    },
    voice: {
      type: YandexVoiceType,
      default: YandexVoiceType.ALENA,
    },
  },
});
