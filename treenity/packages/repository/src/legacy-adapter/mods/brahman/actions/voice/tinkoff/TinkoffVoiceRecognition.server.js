import { set } from '@s-libs/micro-dash';
import { speechToText } from './recognize';
import { VoiceRecognition } from './TinkoffVoiceRecognition.meta';

VoiceRecognition.extend({
  helpers: {
    async run(ctx) {
      const voice = await ctx.downloadFile(ctx.message.voice.file_id);
      const text = await speechToText(voice, this.apiKey, this.apiSecret);
      set(ctx.session, this.saveTo, text);
    },

    callback(ctx) {},
  },
});
