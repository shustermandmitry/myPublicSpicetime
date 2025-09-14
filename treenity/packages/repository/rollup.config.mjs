import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['./src/index.ts', './src/mods.ts', './src/mods.types.ts', './src/client.ts', './src/server.utils.ts', './src/entity.ts'];
export default [
  libraryConfig(inputs, 'node'),
  libraryConfig(inputs, 'browser'),
];
