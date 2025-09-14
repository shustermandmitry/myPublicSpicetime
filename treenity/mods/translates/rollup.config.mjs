import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['./src/index.ts', './src/client.ts', './src/types.ts'];
export default [libraryConfig(inputs, 'node'), libraryConfig(inputs, 'browser')];
