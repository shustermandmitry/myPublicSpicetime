import { Meteor } from '../../../../utils/meteor';
import { fileTypes } from './file-types';
// import fetch from 'node-fetch';
// import { FilesCollection } from 'meteor/ostrio:files';
// import { NamedNode } from '../../../types/named-node/NamedNode.meta';
import { TelegramActionFileUpload } from './TelegramActionFileUpload.meta';

TelegramActionFileUpload.extend({
  helpers: {
    ensureCollection() {
      let mongoCollection = Meteor.Collection.get(this.collectionName);
      let filesCollection;
      if (!mongoCollection) {
        // filesCollection = new FilesCollection({
        //   collectionName: this.collectionName,
        //   permissions: 0o664,
        //   parentDirPermissions: 0o664,
        //   storagePath: this.storagePath,
        //   allowClientCode: false, // Disallow remove files from Client
        //   downloadRoute: '/files',
        // });
      } else {
        filesCollection = mongoCollection.filesCollection;
      }
      return filesCollection;
    },

    getMedia(ctx, subType) {
      if (subType === 'photo') {
        return ctx.update.message.photo[0];
      } else if (fileTypes[subType]) {
        return ctx.update.message[subType];
      }

      return null;
    },

    async run(ctx) {
      // admin alias could be: name1, [name2, name3, ...]
      const isAdmin = this.adminAlias
        .split(',')
        .map(s => s.trim())
        .includes(ctx.from.username);

      if (!isAdmin) {
        return;
      }
      const subType = ctx.updateSubTypes[0];
      const file = this.getMedia(ctx, subType);
      if (!file) return;

      const filesNode = ctx.botNode.findChild({ name: 'files' });
      const uniqId = file.file_unique_id;
      if (filesNode.findChild({ '_m.uniqId': uniqId })) {
        return ctx.reply(`file exists: ${uniqId}`);
      }

      const fileInfo = await ctx.telegram.getFile(file.file_id);
      const { file_path } = fileInfo;

      const fs = this.ensureCollection();
      fs.load(
        `https://api.telegram.org/file/bot${ctx.telegram.token}/${file_path}`,
        {
          name: file.name,
          type: file.mime_type,
          meta: {
            size: file.file_size,
            from: ctx.update.message.from.username,
            type: subType,
            telegramFileId: file.file_id,
          },
        },
        (error, fileRef) => {
          if (error) {
            throw error;
          } else {
            // Replace 'videos/file_15.MP4' -> 'videos_15.MP4'
            const prefix = fileInfo.file_path.replace(/^(\w+)\/\w+(_\d+\.\w+)$/, '$1$2');
            const nodeName = `${prefix}-${uniqId}`;
            // XXX
            // const newChildNode = filesNode.createChild(NamedNode, { name: nodeName });
            // newChildNode.addMeta(TelegramFile, {
            //   file: fileRef,
            //   fileLink: `${this.baseUrl}/${fileRef._id}.${fileRef.ext}`,
            //   caption: ctx.update.message.caption,
            //   uniqId,
            // });
            // newChildNode.save();

            return ctx.reply(`file uploaded: ${nodeName}`);
          }
        },
      );
    },

    callback(ctx) {},
  },
});
