/**
 * Created by kriz on 03/05/16.
 */

import { promisify } from '@treenity/js-shared/utils';
// import fetch from 'node-fetch';
// import xml2js from 'xml2js';
import { makeQueryString } from '../../../../../utils/make-query-string';
import { Random } from '../../../../../utils/random';
import { convertToWav } from '../convert-ffmpeg';

async function sendToYandex(key, input) {
  const url = 'https://asr.yandex.net/asr_xml';

  const params = {
    key,
    uuid: Random._randomString(32, '0123456789abcdef'),
    topic: 'notes',
    lang: 'ru-RU',
  };

  const post = await fetch(url + makeQueryString(params), {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/x-pcm;bit=16;rate=16000',
    },
    body: input,
  });

  const text = await post.text();
  return await promisify('' /* XXX xml2js.parseString*/, null /*xml2js*/)(text);
}

export async function speechToText(input, asrKey) {
  const wavFile = await convertToWav(input);
  const json = await sendToYandex(asrKey, wavFile);

  // return most relevant result
  return json.recognitionResults.variant[0]._;
}
