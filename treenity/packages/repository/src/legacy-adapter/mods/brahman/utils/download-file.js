// import { Meteor } from '../../../../utils/meteor';
// import fetch from 'node-fetch';

import { pipe } from '../../../utils/pipe';

const fs = require('fs');

export async function downloadFile(file_id) {
  const info = await this.telegram.getFile(file_id);
  if (!info.file_path) {
    throw new Error(`no file_path in file info, can't download file ${file_id}`);
  }

  const fullUrl = `https://api.telegram.org/file/bot${this.telegram.token}/${info.file_path}`;
  const response = await fetch(fullUrl);
  if (!response.ok) throw new Error('cant download file');

  return response.body;
}

export async function checkDownloadFile(bot, file_id, savePath, prefix) {
  const file = await bot.telegram.getFile(file_id);
  if (!file.file_path) {
    throw new Error(`no file_path in file info, can't download file ${file_id}`);
  }

  const ext = file.file_path.slice(file.file_path.lastIndexOf('.'));
  const fileName = `${prefix}${file.file_unique_id}${ext}`;
  const filePath = savePath + fileName;

  const fullUrl = `https://api.telegram.org/file/bot${bot.telegram.token}/${file.file_path}`;

  const exists = fs.existsSync(filePath);
  if (!exists) {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('cant download file');

    const outFile = new fs.createWriteStream(filePath);
    await pipe(response.body, outFile);
  }

  return {
    name: fileName,
    path: filePath,
    url: fullUrl,
    exists,
  };
}
