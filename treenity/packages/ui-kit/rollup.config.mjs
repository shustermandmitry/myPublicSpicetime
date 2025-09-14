import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['src/index.ts', 'src/utils.ts', 'src/hooks.ts', 'src/store.ts', 'src/theme.ts'];

export default [
  libraryConfig(inputs, 'browser', {
    check: false,
    only: true,
    external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  }),
];
