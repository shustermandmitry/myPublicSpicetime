import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['src/index.ts', 'src/react.ts'];

export default [
  libraryConfig(inputs, 'browser'),
  libraryConfig(inputs, 'node'),
];
