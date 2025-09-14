// import axios from 'axios';
import fs from 'fs';
import { md5 } from '../../../../../utils/md5';
// import { VoiceSynthesis } from './YandexVoiceSynthesize.meta';

// const qs = require('querystring');

const iamTokens: {
  [key: string]: {
    date: number;
    token: string;
  };
} = {};

// XXX
async function getIamToken(oauthToken: any) {
  const iamToken = iamTokens[oauthToken];

  const date = Date.now();
  if (iamToken && date - iamToken.date < 60 * 60 * 1000) {
    return iamToken.token;
  }

  // const response = await axios.post(
  //   'https://iam.api.cloud.yandex.net/iam/v1/tokens',
  //   `{ "yandexPassportOauthToken": "${oauthToken}" }`,
  // );

  const token = ''; //response.data.iamToken;

  iamTokens[oauthToken] = {
    token,
    date,
  };

  return token;
}

interface ttsParams {
  text: string;
  ssml?: boolean;
  path?: string;
  voice?: string;
}

export async function textToSpeech(
  folderId: string,
  oAuth: string,
  { text, ssml = false, path, voice = 'alena' }: ttsParams,
) {
  const iamToken = await getIamToken(oAuth);

  const params = {
    lang: 'ru-RU',
    voice,
    folderId,
  } as any;

  if (ssml) {
    params.ssml = ssml;
  } else {
    params.text = text;
  }

  // XXX
  // const response = await axios.post(
  //   'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
  //   qs.stringify(params),
  //   {
  //     headers: {
  //       Authorization: `Bearer ${iamToken}`,
  //     },
  //     responseType: 'stream',
  //   },
  // );
  //
  // return response.data;
  return null!;
}

async function writeFile(fileName: any, request: any) {
  if (!fs.existsSync(fileName)) {
    const stream = await request();
    const s = stream.pipe(fs.createWriteStream(fileName));
    return new Promise((res, rej) => {
      s.on('finish', () => res(fileName));
      s.on('error', rej);
    });
  }

  return fileName;
}

export async function synhesizeAudio(folderId: any, oAuth: any, { text, path, voice, ssml }: any) {
  const fileName = `${path}/ytts-${md5(voice + text)}.ogg`;
  if (ssml) text = `<speak>${text}</speak>`;
  return writeFile(fileName, () => textToSpeech(folderId, oAuth, { text, voice, ssml }));
}
