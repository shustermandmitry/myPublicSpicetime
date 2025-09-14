import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['./src/index.ts', './src/client.ts', './src/mods.types.ts'];

export default [
  libraryConfig(inputs, 'node', { external: ['react', 'react-dom', '@emotion/react', '@emotion/styled',] }),
  libraryConfig(inputs, 'browser', { external: ['react', 'react-dom', '@emotion/react', '@emotion/styled',] }),
];
