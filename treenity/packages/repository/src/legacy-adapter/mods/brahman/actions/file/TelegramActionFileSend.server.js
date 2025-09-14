import fs from 'fs';
import { fileTypes } from './file-types';
import { TelegramActionFileSend } from './TelegramActionFileSend.meta';
import { TelegramFile } from './TelegramFile.meta';

TelegramActionFileSend.extend({
  helpers: {
    async run(ctx) {
      const fileNode = ctx.botNode.findChildDeep({ name: this.fileId });
      const file = fileNode.getMeta(TelegramFile).file;
      const type = this.asType || file.meta.type;

      // check is filetype: photo, document, video, etc...
      const typeName = fileTypes[type];
      const methodName = `replyWith${typeName}`;
      if (typeName) {
        if (this.asType && this.asType !== file.meta.type) {
          // send as file
          const src = { source: fs.createReadStream(file.path) };
          const msg = await ctx[methodName](src);

          file.meta.type = type;
          file.meta.telegramFileId = msg[type].file_id;
          fileNode.save();
        } else {
          try {
            await ctx[methodName](file.meta.telegramFileId);
          } catch (err) {
            // maybe file not found, nad we have not it
            if (err.code === 400 && err.description.includes('wrong file')) {
              if (!fs.existsSync(file.path)) {
                const message = `file not found: ${file.path}, ${file.name}`;
                if (Meteor.isDevelopment) return console.warn(message);
                else throw new Error(message);
              }

              const src = { source: fs.createReadStream(file.path) };
              const msg = await ctx[methodName](src);
            }
          }
        }
      }
    },
  },
});
