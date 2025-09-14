import { TelegramAction } from '../TelegramAction.meta';

export const TelegramActionFileUpload = TelegramAction.inherit({
  name: 'tg.action.file.upload',
  fields: {
    adminAlias: {
      type: String,
    },
    baseUrl: {
      type: String,
      default: '/files',
    },
    storagePath: {
      type: String,
      default: `tgfiles/`,
    },
    collectionName: {
      type: String,
      default: 'tgfiles',
    },
  },
});
