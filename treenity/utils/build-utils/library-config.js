import commonJs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typeScript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import externals from 'rollup-plugin-node-externals';
import styles from 'rollup-plugin-styler';
import { visualizer } from 'rollup-plugin-visualizer';
import { pkg } from './rollup-parse-configs.js';
import isomorphicReplace from './rollup-replace-plugin.js';
import fixTsPaths from './rollup-ts-paths.js';

// const tsConfig = parseTsConfig();

const peerDeps = Object.keys(pkg.peerDependencies || {}).map(
  packageName => new RegExp(`^${packageName}(\/.*)?`),
);

export function libraryConfig(inputs, TARGET, opts = {}) {
  const isBrowser = TARGET === 'browser';
  const { bundle, exclude = [], check = true, esm = true, only = false, ...rollupOpts } = opts;
  const targetDir = only ? './dist' : `./dist/${TARGET}`;
  const isProduction = process.env.NODE_ENV === 'production';
  const sourceMap = !isProduction; /* && tsConfig.sourceMap; */

  return {
    ...rollupOpts,
    input: inputs,
    output: [
      {
        format: isBrowser || esm ? 'esm' : 'cjs',
        entryFileNames: isBrowser || esm ? '[name].mjs' : '[name].cjs',
        dir: targetDir,
        sourcemap: sourceMap,
        validate: true,
        assetFileNames: 'assets/[name][extname]',
        preserveModules: true,
        preserveModulesRoot: './src/',
        exports: 'named',
      },
    ],
    onwarn(warning, warn) {
      warn(warning);

      if (!process.env.ROLLUP_WATCH) {
        // exit on warning
        setTimeout(() => process.exit(1), 1000);
      }
      // console.error(warning.message);
    },
    preserveEntrySignatures: 'strict',
    external: [...peerDeps, ...exclude, /\/node_modules\//],
    plugins: [
      ...(opts.plugins || []),
      ...(isProduction ? [terser()] : []),
      // importScss({ fileName: 'styles.css' }),
      externals({
        include: [/^@treenity/],
        exclude: bundle,
      }),
      isomorphicReplace(isBrowser),
      // sourceMap(),
      json(),
      nodeResolve({
        exportConditions: isBrowser ? ['browser'] : ['node'],
        browser: isBrowser,
        preferBuiltins: !isBrowser,
      }),
      typeScript({
        declaration: true,
        declarationDir: targetDir,
        sourceMap,
        strict: check ?? true,
      }),
      fixTsPaths(),
      replace({
        preventAssignment: true,
        'process.env.TARGET': `"${TARGET}"`,
        // 'process.browser': `true`,
        // __buildDate__: () => JSON.stringify(new Date()),
        // __buildVersion: 15
      }),
      commonJs({
        esmExternals: true,
        requireReturnsDefault: 'namespace',
      }),
      styles({ mode: ['extract', 'styles.css'], autoModules: true, minimize: isProduction }),
      copy({
        // copy all src json files to dist into corresponding dirs
        targets: [{ src: 'src/**/*.json', dest: targetDir }],
        flatten: false,
      }),
      visualizer({
        emitFile: true,
        gzipSize: true,
      }),
    ],
  };
}
