import fs from 'fs';
import { convertFfmpeg } from '../convert-ffmpeg';

type SynthesizeVideoParams = {
  name: string;
  path: string;
  audioFile: string;
  videoFile: string;
};

async function synhesizeVideo({
  path,
  name,
  audioFile,
  videoFile,
}: SynthesizeVideoParams): Promise<string> {
  const fileName = `${path}/av-${name}.mp4`;

  if (fs.existsSync(fileName)) return fileName;

  const audioInfo = await convertFfmpeg(audioFile, []).catch(({ error }) => error);
  const durationRegex = /Duration: (.*?),/;
  const match = audioInfo.match(durationRegex);
  if (!match) throw new Error('unknown duration');

  const duration = match[1];

  await convertFfmpeg(
    videoFile,
    ['-i', audioFile, '-t', duration, ...'-c:v copy -map 0:v:0 -map 1:a:0 -f mp4'.split(' ')],
    fileName,
  ).catch(({ error }) => {
    // ffmpeg returning long text, only last line is actual error message
    const lines = error.split('\n');
    const message = lines[lines.length - 2];
    throw new Error(message);
  });

  return fileName;
}

export default synhesizeVideo;
