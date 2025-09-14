import { libraryConfig } from '@treenity/build-utils/library-config.js';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

export default [
  {
    ...libraryConfig(['src/index.ts'], 'browser', {
      check: false,
      only: true,
      external: ['react', 'react-dom', '@emotion/react', '@emotion/styled', 'antd'],
    }),
  },
  // {
  //   ...libraryConfig(['src/server.ts'], 'node', {}),
  // onwarn: warning => {
  //    // TODO: Fix later
  //   if (/(plugin typescript)/.test(warning.message)) return;
  //   throw new Error(warning.message);
  // },
  // },
  {
    input: 'src/style.css',
    output: {
      file: 'dist/style.css',
      format: 'es',
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        sourceMap: process.env.NODE_ENV !== 'production',
        plugins: [
          postcssImport({
            path: ['node_modules'],
          }),
        ],
      }),
    ],
  },
];
