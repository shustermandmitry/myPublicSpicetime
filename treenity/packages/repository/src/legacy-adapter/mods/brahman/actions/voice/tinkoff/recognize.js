import { loadSync } from '@grpc/proto-loader';

import grpc from 'grpc';
import { promisify } from '../../../../../utils/promisify';
import { convertToMp3, NUM_CHANNELS, SAMPLE_RATE } from '../convert-ffmpeg';

import { authorizationMetadata } from './auth';

const host = 'stt.tinkoff.ru';
const port = 443;
const MPEG_AUDIO = 12;

const sttDefinition = loadSync('./assets/app/tinkoff/stt.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const sttGrpc = grpc.loadPackageDefinition(sttDefinition);
const sttApi = sttGrpc.tinkoff.cloud.stt.v1;

export async function recognize(apiKey, secretKey, audio) {
  const stt = new sttApi.SpeechToText(`${host}:${port}`, grpc.credentials.createSsl());
  const Recognize = promisify(stt.Recognize, stt, 2);

  return Recognize(
    {
      audio: {
        content: audio,
      },
      config: {
        encoding: MPEG_AUDIO, // sttApi.AudioEncoding.MPEG_AUDIO,
        sample_rate_hertz: SAMPLE_RATE,
        num_channels: NUM_CHANNELS,
        max_alternatives: 2,
        do_not_perform_vad: false,
        enable_automatic_punctuation: true,

        language_code: 'ru-RU',
      },
    },
    authorizationMetadata(apiKey, secretKey, 'tinkoff.cloud.stt'),
  );
}

export async function speechToText(inputStream, apiKey, apiSecret) {
  const audio = await convertToMp3(inputStream, '-', ['-ar', '16000']);
  const result = await recognize(apiKey, apiSecret, audio);

  // return most relevant result
  return result.results[0].alternatives[0].transcript;
}
