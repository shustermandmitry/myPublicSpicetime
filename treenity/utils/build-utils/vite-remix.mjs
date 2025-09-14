import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig, mergeConfig as mergeViteConfig } from 'vite';
// import { cjsInterop } from 'vite-plugin-cjs-interop';
import commonjs from 'vite-plugin-commonjs';
import tsconfigPaths from 'vite-tsconfig-paths';
import { replaceNoflo } from './vite-replace-noflo.mjs';
import { chunkFileNames, entryFileNames } from './vite-utils.mjs';

export { defineConfig, mergeConfig } from 'vite';

const defaultConfig = remixConfig => ({
  esbuild: { target: 'es2022' }, // for decorators stage-3 to work
  plugins: [
    remix(remixConfig),
    commonjs(),
    tsconfigPaths({ root: './' }),
    // disable the loading of fs-based utils in the browser
    replaceNoflo,
  ],

  build: {
    rollupOptions: {
      output: {
        entryFileNames,
        chunkFileNames,
      },
      /**
       * Ignore "use client" waning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) {
          return;
        }
        warn(warning);
      },
    },
  },
});

function makeConfig(viteConfig, remixConfig) {
  return defineConfig(() => mergeViteConfig(defaultConfig(remixConfig), viteConfig));
}

export default defineConfig(defaultConfig());
export { makeConfig };
