#!/usr/bin/env tsx

import glob from 'fast-glob';
/** update package.json exports for libraries after build **/
import fs from 'fs/promises';
import path from 'node:path';
import tsconfig from 'tsconfig';
import { jsonStringifyCompact } from '../utils/json-stringify-compact';

function sortWithIndex(arr: string[]) {
  arr.sort((a, b) => (/index\.[\w.]+$/.test(a) ? '.' : a).localeCompare(b));
}

async function collectIn(searchPattern: string, outDir: string) {
  const jsFiles = await glob(searchPattern, { cwd: outDir });
  sortWithIndex(jsFiles);
  const exports: any = {};
  for (let js of jsFiles) {
    let name = js.slice(0, js.lastIndexOf('.'));
    const lastSlash = name.lastIndexOf('/');
    if (lastSlash > 0) name = name.slice(lastSlash + 1);

    const base = path.basename(name);
    if (/-[0-9a-f]{8}$/.test(base)) continue;
    exports[name.endsWith('index') ? '.' : `./${name}`] = `${outDir}/${js}`;
  }
  return jsFiles.length ? exports : undefined;
}

async function collectTypes(globPattern: string, outDir: string) {
  const dtsFiles = await glob(globPattern, { cwd: outDir });
  sortWithIndex(dtsFiles);
  const typesVersions: any = { '*': {} };
  for (let dts of dtsFiles) {
    let name = dts.slice(0, -5);
    const lastSlash = name.lastIndexOf('/');
    if (lastSlash > 0) name = name.slice(lastSlash + 1);

    typesVersions['*'][name === 'index' ? '/' : name] = [`${outDir}/${dts}`];
  }
  return dtsFiles.length ? typesVersions : undefined;
}

export async function updatePackageExportsAndTypesVersions(outDir: string, packageJsonStr: string) {
  const packageJson = JSON.parse(packageJsonStr.toString());

  const node = await collectIn(`node/*.*js`, outDir);
  const browser = await collectIn(`browser/*.js`, outDir);

  let exports: { [k: string]: any } = {};
  if (node && browser) {
    Object.keys(node)
      .concat(Object.keys(browser))
      .forEach(key => {
        exports[key] = { node: node[key], default: browser[key] };
      });
  } else {
    exports = await collectIn(`*.js`, outDir);
  }

  packageJson.exports = exports;
  delete packageJson.browser;
  const typesVersions =
    (await collectTypes(`node/*.d.ts`, outDir)) || (await collectTypes(`*.d.ts`, outDir));
  packageJson.typesVersions = typesVersions;

  const packageStr = jsonStringifyCompact(packageJson) + '\n';
  return packageStr;
}

async function main() {
  const tsconfigFile = 'tsconfig.json';
  const ts = await tsconfig.load(process.cwd(), tsconfigFile);
  const { outDir } = ts.config.compilerOptions;
  if (!outDir) throw new Error('no outDir defined in tsconfig');

  const packageJson = (await fs.readFile('package.json')).toString();

  const packageStr = await updatePackageExportsAndTypesVersions(outDir, packageJson);
  await fs.writeFile('package.json', packageStr);
  // console.log('new package', packageStr);

  return '';
}

main().then(console.log, console.error);
