import { zipObject } from '@s-libs/micro-dash';
import { Enum } from '../../../../tree';

export const fileTypes = {
  photo: 'Photo',
  document: 'Document',
  video: 'Video',
  video_note: 'VideoNote',
  audio: 'Audio',
  voice: 'Voice',
  sticker: 'Sticker',
  animation: 'Animation',
};

export const TelegramSubTypes = Enum.create({
  name: 'tg.subTypes',
  identifiers: { None: null, ...zipObject(Object.values(fileTypes), Object.keys(fileTypes)) },
});
