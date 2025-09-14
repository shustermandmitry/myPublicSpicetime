import { Enum } from '../../../../../tree';
import { TelegramAction } from '../../TelegramAction.meta';

export const VoiceSynthesis = TelegramAction.inherit({
  name: 'tg.action.voice.tinkoff.tts',
  fields: {
    apiKey: {
      // tinkoff voice kit key
      type: String,
    },
    apiSecret: {
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
  },
});

export const VoiceGender = Enum.create({
  name: 'tinkoff.tts.voice',
  identifiers: {
    MALE: 1,
    FEMALE: 2,
    NEUTRAL: 3,
  },
});
