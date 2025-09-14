import { loadSync } from '@grpc/proto-loader';
import fs from 'fs';
import grpc from 'grpc';
import stream from 'stream';
import wav from 'wav';
import { md5 } from '../../../../../server/utils/md5';
import { pipe } from '../../../../../server/utils/pipe';
import { convertToOgg } from '../convert-ffmpeg';
// import { promisify } from '../../../../../utils/promisify';
import { authorizationMetadata } from './auth';
import { VoiceGender } from './TinkoffVoiceSynthesize.meta';

const host = 'tts.tinkoff.ru';
const port = 443;
const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;
const FORMAT = 'mp3';
const MPEG_AUDIO = 12;
const LINEAR16 = 1;
const RAW_OPUS = 11;

const ttsDefinition = loadSync('./assets/app/tinkoff/tts.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const ttsGrpc = grpc.loadPackageDefinition(ttsDefinition);
const ttsApi = ttsGrpc.tinkoff.cloud.tts.v1;

// function convertToMp3(stream) {
//   return convertFfmpeg(stream, ['-acodec', FORMAT, '-ac', `${NUM_CHANNELS}`, '-ar', `${SAMPLE_RATE}`, '-f', FORMAT]);
// }

export function synthesize(apiKey, secretKey, { text, gender, encoding }) {
  const tts = new ttsApi.TextToSpeech(`${host}:${port}`, grpc.credentials.createSsl());
  // const Synthesize = promisify(tts.StreamingSynthesize, tts, 2);

  const ttsCall = tts.StreamingSynthesize(
    {
      input: {
        text,
      },
      voice: {
        language_code: 'ru-RU',
        ssml_gender: gender || VoiceGender.FEMALE,
      },
      audio_config: {
        audio_encoding: encoding,
        sample_rate_hertz: SAMPLE_RATE,
      },
    },
    authorizationMetadata(apiKey, secretKey, 'tinkoff.cloud.tts'),
  );

  ttsCall.on('metadata', metadata => console.log('Initial response metadata', metadata));
  ttsCall.on('status', status => {
    console.log('Call ended, status', status);
    // ttsApi.close();
  });
  ttsCall.on('error', error => console.error('Error', error));
  let startedStreaming = false;
  ttsCall.on('data', response => {
    if (!startedStreaming) {
      console.log('Started streaming back audio chunks');
      startedStreaming = true;
    }
  });

  let opusDecoder = null;
  if (encoding === RAW_OPUS) {
    const opus = require('node-opus');
    opusDecoder = new opus.OpusEncoder(SAMPLE_RATE);
  }

  const transformStream = new stream.Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      let pcm_data;
      if (opusDecoder != null) {
        const OPUS_MAX_FRAME_SIZE = 5760;
        pcm_data = opusDecoder.decode(chunk.audio_chunk, OPUS_MAX_FRAME_SIZE);
      } else {
        pcm_data = chunk.audio_chunk;
      }
      callback(null, pcm_data);
    },
  });

  return ttsCall.pipe(transformStream);
}

export async function textToSpeech(apiKey, apiSecret, params) {
  const fileName = `${params.path}/tts-${md5('' + params.gender + params.text)}`;
  const oggName = `${fileName}.ogg`;
  const wavName = `${fileName}.wav`;
  if (!fs.existsSync(oggName)) {
    const stream = synthesize(apiKey, apiSecret, { ...params, encoding: RAW_OPUS });

    const wavStream =
      // new fs.createWriteStream(oggName);
      new wav.FileWriter(wavName, {
        channels: 1,
        sampleRate: SAMPLE_RATE,
        bitDepth: 16,
      });
    await pipe(stream, wavStream);

    await convertToOgg(wavName, oggName);

    return oggName;
  }

  return oggName;
}
