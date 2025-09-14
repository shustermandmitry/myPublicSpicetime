#!/usr/bin/env node

import fs from 'node:fs';

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

const dataJson = readJson('./icomoon/selection.json');
const dataStylePath = './icomoon/style.css';
const fontsDir = './icomoon/fonts';

const array = dataJson.icons.map(i => i.properties.name);

let buf = 'const iconNames = [\n';

const iconTypes = ['filled', 'outlined'];

let errorTypeIcons = [];

array.sort().forEach(i => {
  const [, type] = i.split('_');
  if (!type && !iconTypes.includes(type)) {
    errorTypeIcons.push(i);
  }

  buf += `  '${i}',\n`;
});

if (errorTypeIcons.length > 0) {
  console.error('\x1b[32m%s\x1b[0m', errorTypeIcons);
  throw new Error(`unknown icon type: ${errorTypeIcons}, should end with: '_' and ${iconTypes}`);
}

buf += '] as const;\n';
buf += 'export default iconNames;\n';

fs.writeFileSync('./icons-names.ts', buf);

fs.readdir(fontsDir, (err, files) => {
  if (err) {
    console.error(`Failed to read directory: ${err.message}`);
    return;
  }
  files.forEach(file => {
    if (file.split('.').pop() === 'svg') {
      const filePath = `${fontsDir}/${file}`;
      try {
        fs.rmSync(filePath);
        console.log(`File deleted: ${filePath} 👍`);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}, error: ${err.message}`);
      }
    }
  });
});

function removeSvgFontEntry(filePath) {
  const cssContent = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = cssContent.replace(
    /,\s*url\('fonts\/[^']+\.svg\?[^']+'\)\s*format\('svg'\)/gm,
    '',
  );
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

removeSvgFontEntry('./icomoon/style.css');
removeSvgFontEntry(dataStylePath);

const iconRegex = /\.icon-([a-zA-Z0-9-_]+):before\s*{\s*content:\s*"\\([a-fA-F0-9]+)";\s*}/gm;
const cssContent = fs.readFileSync(dataStylePath, 'utf-8');

if (!cssContent) {
  console.log(`file ` + dataStylePath + ` not found`);
}

const iconsObject = {};

let match;
while ((match = iconRegex.exec(cssContent)) !== null) {
  const iconName = match[1];
  const iconCode = match[2];
  iconsObject[iconName] = `\\\\${iconCode}`;
}

let tsContent = 'const iconObject = {\n';

for (const [key, value] of Object.entries(iconsObject)) {
  tsContent += `  '${key}': '${value}',\n`;
}

tsContent += '};\n';
tsContent += 'export default iconObject;\n';

fs.writeFileSync('./icons-object.ts', tsContent, 'utf-8');

console.log('Icons object created successfully.');
