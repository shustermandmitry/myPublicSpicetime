import { Enum } from '../../../../../tree';
import { VoiceSynthesis } from '../tinkoff/TinkoffVoiceSynthesize.meta';

export const VoiceVendor = Enum.create({
  name: 'tg.action.voice.vendor',
  identifiers: {
    TINKOFF: 'tinkoff',
    YANDEX: 'yandex',
  },
});

export const VoiceGender = Enum.create({
  name: 'tg.action.voice.gender',
  identifiers: {
    FEMALE: 'female',
    MALE: 'male',
  },
});

export const SynhesizeAudioVideo = VoiceSynthesis.inherit({
  name: 'tg.action.voice.synthAV',
  fields: {
    vendor: {
      type: VoiceVendor,
      default: VoiceVendor.TINKOFF,
    },
    gender: {
      type: VoiceGender,
      default: VoiceGender.FEMALE,
    },
    fileId: {
      type: String,
      optional: true,
      form: {
        type: 'fileId',
      },
    },
    chatFrom: {
      type: String,
      default: '',
    },
  },
});
