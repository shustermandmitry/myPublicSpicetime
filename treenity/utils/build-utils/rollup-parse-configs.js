import fs from 'node:fs';
import ts from 'typescript';

export function parseTsConfig() {
  const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error('Could not find a valid tsconfig.json.');
  }
  const tsUnparsed = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options: tsConfig } = ts.parseJsonConfigFileContent(tsUnparsed.config, ts.sys, process.cwd());
  return tsConfig;
}

export const pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json').toString());