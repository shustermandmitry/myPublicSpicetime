import fs from 'fs';
import { textToSpeech } from './synthesize';
import { VoiceSynthesis } from './TinkoffVoiceSynthesize.meta';

VoiceSynthesis.extend({
  helpers: {
    async run(ctx) {
      // const voice = await ctx.downloadFile(ctx.message.voice.file_id);
      const text = ctx.format(this.textFrom);
      const path = this.path;

      const voiceFileName = await textToSpeech(this.apiKey, this.apiSecret, { text, path });
      // ctx.set(this.saveTo || 'voiceText', text);
      console.log(voiceFileName);

      const voice = { source: fs.createReadStream(voiceFileName) };

      return ctx.replyWithVoice(voice);
    },

    callback(ctx) {},
  },
});
