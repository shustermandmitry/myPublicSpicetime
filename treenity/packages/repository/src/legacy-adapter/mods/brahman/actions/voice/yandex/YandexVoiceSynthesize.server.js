import fs from 'fs';
import { synhesizeAudio } from './yandex-tts';
import { VoiceSynthesis } from './YandexVoiceSynthesize.meta';
// import { md5 } from '../../../../../utils/md5';
// import { convertFfmpeg } from '../convert-ffmpeg';

VoiceSynthesis.extend({
  helpers: {
    async run(ctx) {
      // const voice = await ctx.downloadFile(ctx.message.voice.file_id);
      const text = ctx.format(this.textFrom);
      const path = this.path;
      const voice = this.voice;

      const voiceFileName = await synhesizeAudio(this.folderId, this.oAuth, { text, path, voice });
      // ctx.set(this.saveTo || 'voiceText', text);
      console.log(voiceFileName);

      const voiceSource = { source: fs.createReadStream(voiceFileName) };

      return ctx.replyWithVoice(voiceSource);
    },

    callback(ctx) {},
  },
});
