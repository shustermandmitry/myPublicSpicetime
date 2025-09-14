import { TelegramAction } from '../TelegramAction.meta';
import { TelegramSubTypes } from './file-types';

export const TelegramActionFileSend = TelegramAction.inherit({
  name: 'tg.action.file.send',
  fields: {
    fileId: String,
    asType: {
      type: TelegramSubTypes,

      optional: true,
    },
  },
});
