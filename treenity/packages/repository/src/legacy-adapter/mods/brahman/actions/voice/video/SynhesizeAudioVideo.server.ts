import fs from 'fs';
import { md5 } from '../../../../../server/utils/md5';
import { error } from '../../../../../utils/log';
import { TelegramFile } from '../../file/TelegramFile.meta';
import { textToSpeech as tinkoffTTS } from '../tinkoff/synthesize';
import { VoiceGender as TinkoffVoiceGender } from '../tinkoff/TinkoffVoiceSynthesize.meta';
import { synhesizeAudio as yandexTTS } from '../yandex/yandex-tts';
import { SynhesizeAudioVideo, VoiceGender, VoiceVendor } from './SynhesizeAudioVideo.meta';
import synhesizeVideo from './synthesize-video';

function getFilePath(ctx, fileId: string) {
  const fileNode = ctx.botNode.findChildDeep({ name: fileId });
  const file = fileNode?.getMeta(TelegramFile).file;
  return file.path;
}

SynhesizeAudioVideo.extend({
  helpers: {
    async run(ctx) {
      return this.runX(ctx).catch(err => error('SYNTH-AV', 'cant send audio-video', err));
    },

    async runX(ctx) {
      // const voice = await ctx.downloadFile(ctx.message.voice.file_id);
      const text = ctx.format(this.textFrom);
      const path = this.path;

      ctx.replyWithChatAction('record_video');

      const audioFile = await (() => {
        if (this.vendor === VoiceVendor.TINKOFF) {
          const gender =
            this.gender === VoiceGender.FEMALE
              ? TinkoffVoiceGender.FEMALE
              : TinkoffVoiceGender.MALE;
          return tinkoffTTS(this.apiKey, this.apiSecret, { text, path, gender });
        } else {
          const voice = this.gender === VoiceGender.FEMALE ? 'alena' : 'filipp';
          return yandexTTS(this.apiKey, this.apiSecret, { text, path, voice, ssml: false });
        }
      })();

      const videoFile = getFilePath(ctx, this.fileId);

      const videoFileName = await synhesizeVideo({
        audioFile,
        videoFile,
        name: md5(this.vendor + this.gender + text),
        path,
      });
      // ctx.set(this.saveTo || 'voiceText', text);
      console.log(videoFileName);

      const voice = { source: fs.createReadStream(videoFileName) };

      if (this.chatFrom) {
        return ctx.telegram.sendVideoNote(ctx.format(this.chatFrom), voice);
      }
      return ctx.replyWithVideoNote(voice);
    },
  },
});
