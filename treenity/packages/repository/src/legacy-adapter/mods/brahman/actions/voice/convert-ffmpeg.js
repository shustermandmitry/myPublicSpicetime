import { spawn } from 'child_process';

//
export function convertFfmpeg(inputStream, args, outFile) {
  const isStream = typeof inputStream !== 'string';
  const input = isStream ? '-' : inputStream;

  const ffmpeg = spawn('ffmpeg', ['-y', '-i', input, ...args, outFile || '-']);

  return new Promise((resolve, reject) => {
    let error = '';

    let buf = Buffer.from([]);

    ffmpeg.on('close', code => {
      if (code !== 0) {
        reject({ code, error });
      } else {
        resolve(buf);
      }
    });
    ffmpeg.stdout.on('data', data => {
      buf = Buffer.concat([buf, data]);
    });
    ffmpeg.stderr.on('data', data => (error += data.toString()));

    if (isStream) {
      inputStream.pipe(ffmpeg.stdin);
    }
  });
}

export const SAMPLE_RATE = 16000;
export const NUM_CHANNELS = 1;

function convertTo(stream, format, file) {
  return convertFfmpeg(
    stream,
    ['-acodec', format, '-ac', `${NUM_CHANNELS}`, '-ar', `${SAMPLE_RATE}`, '-f', format],
    file,
  );
}

export function convertToWav(stream, file) {
  return convertTo(stream, 'wav', file);
}

const MP3_FORMAT = 'mp3';
export function convertToMp3(stream, file, options = []) {
  return convertFfmpeg(
    stream,
    ['-acodec', MP3_FORMAT, '-ac', `${NUM_CHANNELS}`, '-f', MP3_FORMAT, ...options],
    file,
  );
}

const OGG_FORMAT = 'ogg';
export function convertToOgg(stream, file) {
  return convertFfmpeg(stream, ['-acodec', 'libopus', '-ac', `${NUM_CHANNELS}`, '-f', 'ogg'], file);
}
