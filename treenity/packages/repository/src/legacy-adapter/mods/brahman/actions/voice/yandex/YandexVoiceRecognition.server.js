import { speechToText } from './voice-to-asr';
import { VoiceRecognition } from './YandexVoiceRecognition.meta';

VoiceRecognition.extend({
  helpers: {
    async run(ctx) {
      const voice = await ctx.downloadFile(ctx.message.voice.file_id);
      const text = await speechToText(voice, this.asrKey);
      ctx.set(this.saveTo || 'voiceText', text);
    },

    callback(ctx) {},
  },
});
