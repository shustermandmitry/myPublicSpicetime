import { libraryConfig } from '@treenity/build-utils/library-config.js';

const inputs = ['src/index.ts', 'src/entity.ts'];

export default [libraryConfig(inputs, 'browser'), libraryConfig(inputs, 'node')];
